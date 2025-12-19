import type { Phase } from '../../../../../shared/types/index.js';

const VALID_TRANSITIONS: Record<Phase, Phase[]> = {
  idle: ['intake'],
  intake: ['debate'],
  debate: ['plan_drafting', 'pre_vote'],
  plan_drafting: ['pre_vote', 'vote'],
  pre_vote: ['vote', 'plan_drafting'],
  vote: ['commit', 'plan_drafting'],
  commit: ['idle']
};

export class PhaseValidator {
  static isValidTransition(from: Phase, to: Phase): boolean {
    const allowedTransitions = VALID_TRANSITIONS[from];
    return allowedTransitions.includes(to);
  }

  static getNextValidPhases(current: Phase): Phase[] {
    return VALID_TRANSITIONS[current] || [];
  }

  static validateTransition(from: Phase, to: Phase): { valid: boolean; error?: string } {
    if (from === to) {
      return { valid: false, error: 'Cannot transition to the same phase' };
    }

    if (!this.isValidTransition(from, to)) {
      const validPhases = this.getNextValidPhases(from).join(', ');
      return {
        valid: false,
        error: `Invalid transition from ${from} to ${to}. Valid transitions: ${validPhases}`
      };
    }

    return { valid: true };
  }
}
