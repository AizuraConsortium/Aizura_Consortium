/**
 * Steps Repository
 *
 * Complete CRUD operations for steps table with:
 * - Full type safety
 * - Comprehensive validation
 * - Circular dependency detection
 * - Status transition validation
 * - Dependency chain management
 */

import { BaseRepository, type OperationContext } from './BaseRepository.js';
import {
  NotFoundError,
  ValidationError,
  CircularDependencyError,
  DependencyBlockedError,
  StateTransitionError,
} from './errors/RepositoryError.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type Step = Database['public']['Tables']['steps']['Row'];
type StepInsert = Database['public']['Tables']['steps']['Insert'];
type StepUpdate = Database['public']['Tables']['steps']['Update'];
type StepStatus = Step['status'];

const VALID_STEP_STATUSES: readonly StepStatus[] = ['todo', 'in_progress', 'blocked', 'done'] as const;
const VALID_AGENT_ROLES = [
  'product-strategy',
  'engineering-arch',
  'gtm-marketing',
  'ops-automation',
  'finance-tokenomics',
  'risk-compliance'
] as const;

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 500;
const ETA_MIN_DAYS = 0;
const ETA_MAX_DAYS = 365;

/**
 * Steps Repository
 */
class StepsRepository extends BaseRepository {
  constructor() {
    super('steps');
  }

  /**
   * Create a new step with validation
   */
  async createStep(data: StepInsert): Promise<Step> {
    const context: OperationContext = {
      operation: 'createStep',
      table: 'steps',
      metadata: { planId: data.plan_id, title: data.title },
    };

    return this.execute(async () => {
      this.validateStepData(data);

      if (data.depends_on) {
        await this.validateDependencyExists(data.depends_on);

        await this.validateNoCyclicDependency(
          data.plan_id,
          data.depends_on,
          []
        );
      }

      const { data: step, error } = await this.client
        .from('steps')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (!step) throw new Error('Failed to create step');

      return step;
    }, context);
  }

  /**
   * Get all steps for a plan, ordered by dependencies
   */
  async getStepsForPlan(planId: string): Promise<Step[]> {
    const context: OperationContext = {
      operation: 'getStepsForPlan',
      table: 'steps',
      metadata: { planId },
    };

    return this.execute(async () => {
      this.validateRequired(planId, 'planId');
      this.validatePlanId(planId);

      const { data, error } = await this.client
        .from('steps')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return this.sortStepsByDependencies(data || []);
    }, context);
  }

  /**
   * Get a single step by ID
   */
  async getStepById(stepId: string): Promise<Step> {
    const context: OperationContext = {
      operation: 'getStepById',
      table: 'steps',
      resourceId: stepId,
    };

    return this.execute(async () => {
      this.validateRequired(stepId, 'stepId');
      this.validateStepId(stepId);

      const { data, error } = await this.client
        .from('steps')
        .select('*')
        .eq('id', stepId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Step', stepId);
        }
        throw error;
      }

      return data;
    }, context);
  }

  /**
   * Update step status with state validation
   */
  async updateStepStatus(stepId: string, status: StepStatus): Promise<Step> {
    const context: OperationContext = {
      operation: 'updateStepStatus',
      table: 'steps',
      resourceId: stepId,
      metadata: { status },
    };

    return this.execute(async () => {
      this.validateRequired(stepId, 'stepId');
      this.validateStepId(stepId);
      this.validateStepStatus(status);

      const currentStep = await this.getStepById(stepId);

      this.validateStatusTransition(currentStep.status, status);

      if (status === 'in_progress' || status === 'done') {
        if (currentStep.depends_on) {
          const dependency = await this.getStepById(currentStep.depends_on);
          if (dependency.status !== 'done') {
            throw new DependencyBlockedError(
              `Step ${stepId}`,
              [`Step ${dependency.id} (${dependency.title}) must be completed first`]
            );
          }
        }
      }

      const { data, error } = await this.client
        .from('steps')
        .update({ status })
        .eq('id', stepId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update step status');

      return data;
    }, context);
  }

  /**
   * Update step ETA with validation
   */
  async updateStepEta(stepId: string, etaDays: number | null): Promise<Step> {
    const context: OperationContext = {
      operation: 'updateStepEta',
      table: 'steps',
      resourceId: stepId,
      metadata: { etaDays },
    };

    return this.execute(async () => {
      this.validateRequired(stepId, 'stepId');
      this.validateStepId(stepId);

      if (etaDays !== null) {
        this.validateEta(etaDays);
      }

      const { data, error } = await this.client
        .from('steps')
        .update({ eta_days: etaDays })
        .eq('id', stepId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Step', stepId);
        }
        throw error;
      }

      if (!data) throw new Error('Failed to update step ETA');

      return data;
    }, context);
  }

  /**
   * Delete a step with dependency checking
   */
  async deleteStep(stepId: string): Promise<void> {
    const context: OperationContext = {
      operation: 'deleteStep',
      table: 'steps',
      resourceId: stepId,
    };

    return this.execute(async () => {
      this.validateRequired(stepId, 'stepId');
      this.validateStepId(stepId);

      const step = await this.getStepById(stepId);

      const dependentSteps = await this.getStepsDependingOn(stepId);
      if (dependentSteps.length > 0) {
        throw new DependencyBlockedError(
          `Step ${stepId}`,
          dependentSteps.map(s => `Step ${s.id} (${s.title})`)
        );
      }

      const { error } = await this.client
        .from('steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;
    }, context);
  }

  /**
   * Get full dependency chain for a step
   */
  async getStepDependencyChain(stepId: string): Promise<Step[]> {
    const context: OperationContext = {
      operation: 'getStepDependencyChain',
      table: 'steps',
      resourceId: stepId,
    };

    return this.execute(async () => {
      this.validateRequired(stepId, 'stepId');
      this.validateStepId(stepId);

      const chain: Step[] = [];
      let currentId: string | null = stepId;

      while (currentId) {
        const step = await this.getStepById(currentId);
        chain.push(step);
        currentId = step.depends_on;
      }

      return chain.reverse();
    }, context);
  }

  /**
   * Get steps by status
   */
  async getStepsByStatus(planId: string, status: StepStatus): Promise<Step[]> {
    const context: OperationContext = {
      operation: 'getStepsByStatus',
      table: 'steps',
      metadata: { planId, status },
    };

    return this.execute(async () => {
      this.validateRequired(planId, 'planId');
      this.validatePlanId(planId);
      this.validateStepStatus(status);

      const { data, error } = await this.client
        .from('steps')
        .select('*')
        .eq('plan_id', planId)
        .eq('status', status)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    }, context);
  }

  /**
   * Get blocked steps (steps waiting on dependencies)
   */
  async getBlockedSteps(planId: string): Promise<Array<Step & { blocking_step: Step }>> {
    const context: OperationContext = {
      operation: 'getBlockedSteps',
      table: 'steps',
      metadata: { planId },
    };

    return this.execute(async () => {
      this.validateRequired(planId, 'planId');
      this.validatePlanId(planId);

      const allSteps = await this.getStepsForPlan(planId);
      const blockedSteps: Array<Step & { blocking_step: Step }> = [];

      for (const step of allSteps) {
        if (step.depends_on && step.status !== 'done') {
          const dependency = allSteps.find(s => s.id === step.depends_on);
          if (dependency && dependency.status !== 'done') {
            blockedSteps.push({
              ...step,
              blocking_step: dependency,
            });
          }
        }
      }

      return blockedSteps;
    }, context);
  }

  /**
   * Validate step dependencies (circular dependency detection)
   */
  async validateStepDependencies(planId: string): Promise<{ valid: boolean; errors: string[] }> {
    const context: OperationContext = {
      operation: 'validateStepDependencies',
      table: 'steps',
      metadata: { planId },
    };

    return this.execute(async () => {
      this.validateRequired(planId, 'planId');
      this.validatePlanId(planId);

      const steps = await this.getStepsForPlan(planId);
      const errors: string[] = [];

      for (const step of steps) {
        if (step.depends_on) {
          try {
            await this.validateNoCyclicDependency(
              planId,
              step.depends_on,
              [step.id]
            );
          } catch (error) {
            if (error instanceof CircularDependencyError) {
              errors.push(error.message);
            }
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    }, context);
  }

  /**
   * Reorder steps (batch operation)
   */
  async reorderSteps(updates: Array<{ id: string; depends_on: string | null }>): Promise<Step[]> {
    const context: OperationContext = {
      operation: 'reorderSteps',
      table: 'steps',
      metadata: { count: updates.length },
    };

    return this.execute(async () => {
      if (!updates || updates.length === 0) {
        throw ValidationError.single('updates', 'Updates array cannot be empty', updates);
      }

      const updatedSteps: Step[] = [];

      for (const update of updates) {
        this.validateStepId(update.id);

        if (update.depends_on) {
          this.validateStepId(update.depends_on);
        }
      }

      for (const update of updates) {
        if (update.depends_on) {
          const step = await this.getStepById(update.id);
          await this.validateNoCyclicDependency(
            step.plan_id,
            update.depends_on,
            [update.id]
          );
        }
      }

      for (const update of updates) {
        const { data, error } = await this.client
          .from('steps')
          .update({ depends_on: update.depends_on })
          .eq('id', update.id)
          .select()
          .single();

        if (error) throw error;
        if (data) updatedSteps.push(data);
      }

      return updatedSteps;
    }, context);
  }

  /**
   * Private: Validate step data
   */
  private validateStepData(data: StepInsert): void {
    this.validateRequired(data.plan_id, 'plan_id');
    this.validatePlanId(data.plan_id);

    this.validateRequired(data.title, 'title');
    this.validateLength(data.title, 'title', TITLE_MIN_LENGTH, TITLE_MAX_LENGTH);

    this.validateRequired(data.owner_agent_role, 'owner_agent_role');
    this.validateAgentRole(data.owner_agent_role);

    if (data.status) {
      this.validateStepStatus(data.status);
    }

    if (data.eta_days !== null && data.eta_days !== undefined) {
      this.validateEta(data.eta_days);
    }
  }

  /**
   * Private: Validate step status
   */
  private validateStepStatus(status: unknown): void {
    if (!VALID_STEP_STATUSES.includes(status as StepStatus)) {
      throw ValidationError.single(
        'status',
        `Invalid status. Must be one of: ${VALID_STEP_STATUSES.join(', ')}`,
        status
      );
    }
  }

  /**
   * Private: Validate agent role
   */
  private validateAgentRole(role: string): void {
    if (!VALID_AGENT_ROLES.includes(role as typeof VALID_AGENT_ROLES[number])) {
      throw ValidationError.single(
        'owner_agent_role',
        `Invalid agent role. Must be one of: ${VALID_AGENT_ROLES.join(', ')}`,
        role
      );
    }
  }

  /**
   * Private: Validate ETA
   */
  private validateEta(etaDays: number): void {
    if (!Number.isInteger(etaDays) || etaDays < ETA_MIN_DAYS || etaDays > ETA_MAX_DAYS) {
      throw ValidationError.single(
        'eta_days',
        `ETA must be between ${ETA_MIN_DAYS} and ${ETA_MAX_DAYS} days`,
        etaDays
      );
    }
  }

  /**
   * Private: Validate step ID format
   */
  private validateStepId(stepId: string): void {
    if (!this.isValidUuid(stepId)) {
      throw ValidationError.single('stepId', 'Invalid step ID format', stepId);
    }
  }

  /**
   * Private: Validate plan ID format
   */
  private validatePlanId(planId: string): void {
    if (!this.isValidUuid(planId)) {
      throw ValidationError.single('planId', 'Invalid plan ID format', planId);
    }
  }

  /**
   * Private: Validate status transition
   */
  private validateStatusTransition(currentStatus: StepStatus, newStatus: StepStatus): void {
    const validTransitions: Record<StepStatus, StepStatus[]> = {
      todo: ['in_progress', 'blocked'],
      in_progress: ['blocked', 'done'],
      blocked: ['todo', 'in_progress'],
      done: [],
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new StateTransitionError('step', currentStatus, newStatus, allowed);
    }
  }

  /**
   * Private: Check if dependency exists
   */
  private async validateDependencyExists(stepId: string): Promise<void> {
    try {
      await this.getStepById(stepId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw ValidationError.single(
          'depends_on',
          `Dependency step ${stepId} does not exist`,
          stepId
        );
      }
      throw error;
    }
  }

  /**
   * Private: Validate no cyclic dependencies
   */
  private async validateNoCyclicDependency(
    planId: string,
    dependsOn: string,
    visited: string[]
  ): Promise<void> {
    if (visited.includes(dependsOn)) {
      throw new CircularDependencyError('step dependencies', [...visited, dependsOn]);
    }

    const dependency = await this.getStepById(dependsOn);

    if (dependency.plan_id !== planId) {
      throw ValidationError.single(
        'depends_on',
        'Dependencies must be within the same plan',
        { dependsOn, planId, dependencyPlanId: dependency.plan_id }
      );
    }

    if (dependency.depends_on) {
      await this.validateNoCyclicDependency(
        planId,
        dependency.depends_on,
        [...visited, dependsOn]
      );
    }
  }

  /**
   * Private: Get steps that depend on a given step
   */
  private async getStepsDependingOn(stepId: string): Promise<Step[]> {
    const { data, error } = await this.client
      .from('steps')
      .select('*')
      .eq('depends_on', stepId);

    if (error) throw error;
    return data || [];
  }

  /**
   * Private: Sort steps by dependencies (topological sort)
   */
  private sortStepsByDependencies(steps: Step[]): Step[] {
    const sorted: Step[] = [];
    const visited = new Set<string>();
    const stepsMap = new Map(steps.map(s => [s.id, s]));

    const visit = (stepId: string) => {
      if (visited.has(stepId)) return;

      const step = stepsMap.get(stepId);
      if (!step) return;

      if (step.depends_on && stepsMap.has(step.depends_on)) {
        visit(step.depends_on);
      }

      visited.add(stepId);
      sorted.push(step);
    };

    steps.forEach(step => visit(step.id));

    return sorted;
  }
}

export const stepsRepository = new StepsRepository();

export const {
  createStep,
  getStepsForPlan,
  getStepById,
  updateStepStatus,
  updateStepEta,
  deleteStep,
  getStepDependencyChain,
  getStepsByStatus,
  getBlockedSteps,
  validateStepDependencies,
  reorderSteps,
} = stepsRepository;
