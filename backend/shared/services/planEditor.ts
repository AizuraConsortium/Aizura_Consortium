import type { PlanEditorArgs, AgentId } from '../../../shared/types/index.js';
import { BUSINESS_PLAN_TEMPLATE } from '../types/prompts.js';
import { ErrorLogger } from './errorLogger.js';

export interface PlanEditorResult {
  revisionId: string;
  planMd: string;
  addedChars: number;
  removedChars: number;
}

export class PlanEditor {
  applyEdit(currentPlan: string, args: PlanEditorArgs, agentId: AgentId): PlanEditorResult {
    let newPlan = currentPlan;
    let addedChars = 0;
    let removedChars = 0;

    switch (args.op) {
      case 'upsert_section':
        ({ newPlan, addedChars, removedChars } = this.upsertSection(currentPlan, args));
        break;
      case 'append':
        ({ newPlan, addedChars } = this.append(currentPlan, args));
        break;
      case 'replace':
        ({ newPlan, addedChars, removedChars } = this.replace(currentPlan, args));
        break;
      case 'delete':
        ({ newPlan, removedChars } = this.deleteSection(currentPlan, args));
        break;
      case 'move':
        ({ newPlan } = this.move(currentPlan, args, agentId));
        break;
    }

    const revisionId = this.generateRevisionId();

    return {
      revisionId,
      planMd: newPlan,
      addedChars,
      removedChars
    };
  }

  private upsertSection(plan: string, args: PlanEditorArgs): { newPlan: string; addedChars: number; removedChars: number } {
    const sections = args.path.split('/');
    const lines = plan.split('\n');
    const targetHeading = this.buildHeading(sections);

    const sectionIndex = this.findSectionIndex(lines, targetHeading);

    if (sectionIndex === -1) {
      const insertIndex = this.findInsertionPoint(lines, sections);
      const content = args.content_md || '';
      const newContent = `\n${targetHeading}\n\n${content}\n`;

      lines.splice(insertIndex, 0, ...newContent.split('\n'));

      return {
        newPlan: lines.join('\n'),
        addedChars: newContent.length,
        removedChars: 0
      };
    }

    const endIndex = this.findSectionEnd(lines, sectionIndex, sections.length);
    const oldContent = lines.slice(sectionIndex + 1, endIndex).join('\n');
    const newContent = args.content_md || '';

    lines.splice(sectionIndex + 1, endIndex - sectionIndex - 1, ...newContent.split('\n'));

    return {
      newPlan: lines.join('\n'),
      addedChars: newContent.length,
      removedChars: oldContent.length
    };
  }

  private append(plan: string, args: PlanEditorArgs): { newPlan: string; addedChars: number } {
    const content = args.content_md || '';
    const newPlan = plan + '\n\n' + content;

    return {
      newPlan,
      addedChars: content.length + 2
    };
  }

  private replace(plan: string, args: PlanEditorArgs): { newPlan: string; addedChars: number; removedChars: number } {
    const sections = args.path.split('/');
    const lines = plan.split('\n');
    const targetHeading = this.buildHeading(sections);

    const sectionIndex = this.findSectionIndex(lines, targetHeading);

    if (sectionIndex === -1) {
      return { newPlan: plan, addedChars: 0, removedChars: 0 };
    }

    const endIndex = this.findSectionEnd(lines, sectionIndex, sections.length);
    const oldSection = lines.slice(sectionIndex, endIndex).join('\n');
    const newContent = args.content_md || '';
    const newSection = `${targetHeading}\n\n${newContent}`;

    lines.splice(sectionIndex, endIndex - sectionIndex, ...newSection.split('\n'));

    return {
      newPlan: lines.join('\n'),
      addedChars: newSection.length,
      removedChars: oldSection.length
    };
  }

  private deleteSection(plan: string, args: PlanEditorArgs): { newPlan: string; removedChars: number } {
    const sections = args.path.split('/');
    const lines = plan.split('\n');
    const targetHeading = this.buildHeading(sections);

    const sectionIndex = this.findSectionIndex(lines, targetHeading);

    if (sectionIndex === -1) {
      return { newPlan: plan, removedChars: 0 };
    }

    const endIndex = this.findSectionEnd(lines, sectionIndex, sections.length);
    const removed = lines.slice(sectionIndex, endIndex).join('\n');

    lines.splice(sectionIndex, endIndex - sectionIndex);

    return {
      newPlan: lines.join('\n'),
      removedChars: removed.length
    };
  }

  private move(plan: string, args: PlanEditorArgs, agentId: AgentId): { newPlan: string } {
    if (!args.target_path) {
      console.warn('Move operation requires target_path');
      return { newPlan: plan };
    }

    // Prevent moving section to the same path (no-op)
    if (args.path === args.target_path) {
      console.warn('Cannot move section to the same path');
      ErrorLogger.getInstance().logError({
        source: 'backend',
        severity: 'warning',
        agentId,
        errorType: 'invalid_plan_move',
        message: 'Attempted to move section to the same path',
        details: { path: args.path, target_path: args.target_path, reason: 'same_path' }
      }).catch((err: unknown) => console.error('Failed to log error:', err));
      return { newPlan: plan };
    }

    // Prevent moving section into itself or its descendants (cycle detection)
    if (args.target_path.startsWith(args.path + '/')) {
      console.warn('Cannot move section into itself or its descendants');
      ErrorLogger.getInstance().logError({
        source: 'backend',
        severity: 'warning',
        agentId,
        errorType: 'invalid_plan_move',
        message: 'Attempted to move section into itself or its descendants',
        details: { path: args.path, target_path: args.target_path, reason: 'circular_dependency' }
      }).catch((err: unknown) => console.error('Failed to log error:', err));
      return { newPlan: plan };
    }

    const sections = args.path.split('/');
    const targetSections = args.target_path.split('/');
    const lines = plan.split('\n');

    // Find source section
    const sourceHeading = this.buildHeading(sections);
    const sourceIndex = this.findSectionIndex(lines, sourceHeading);

    if (sourceIndex === -1) {
      console.warn(`Source section not found: ${args.path}`);
      return { newPlan: plan };
    }

    // Validate target path exists (parent must exist)
    if (targetSections.length > 1) {
      const targetParent = targetSections.slice(0, -1);
      const targetParentHeading = this.buildHeading(targetParent);
      const targetParentIndex = this.findSectionIndex(lines, targetParentHeading);

      if (targetParentIndex === -1) {
        console.warn(`Target parent section not found: ${targetParent.join('/')}`);
        return { newPlan: plan };
      }
    }

    // Extract source section
    const sourceEnd = this.findSectionEnd(lines, sourceIndex, sections.length);
    const sectionContent = lines.slice(sourceIndex, sourceEnd);

    // Remove source section
    lines.splice(sourceIndex, sourceEnd - sourceIndex);

    // Find insertion point for target
    const insertIndex = this.findInsertionPoint(lines, targetSections);

    // Update heading to match new path
    const newHeading = this.buildHeading(targetSections);
    sectionContent[0] = newHeading;

    // Insert at target location
    lines.splice(insertIndex, 0, ...sectionContent);

    return { newPlan: lines.join('\n') };
  }

  private buildHeading(sections: string[]): string {
    const level = sections.length;
    const hashes = '#'.repeat(level);
    const title = sections[sections.length - 1];
    return `${hashes} ${title}`;
  }

  private findSectionIndex(lines: string[], heading: string): number {
    return lines.findIndex(line => line.trim() === heading.trim());
  }

  private findSectionEnd(lines: string[], startIndex: number, level: number): number {
    const headingPrefix = '#'.repeat(level);

    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#')) {
        const lineLevel = line.match(/^#+/)?.[0].length || 0;
        if (lineLevel <= level) {
          return i;
        }
      }
    }

    return lines.length;
  }

  private findInsertionPoint(lines: string[], sections: string[]): number {
    if (sections.length === 1) {
      return lines.length;
    }

    const parentSections = sections.slice(0, -1);
    const parentHeading = this.buildHeading(parentSections);
    const parentIndex = this.findSectionIndex(lines, parentHeading);

    if (parentIndex === -1) {
      return lines.length;
    }

    const parentEnd = this.findSectionEnd(lines, parentIndex, parentSections.length);
    return parentEnd;
  }

  private generateRevisionId(): string {
    return `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  initializePlan(title: string): string {
    return BUSINESS_PLAN_TEMPLATE.replace('[Business Name]', title);
  }
}
