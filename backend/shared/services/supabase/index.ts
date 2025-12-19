export { getSupabaseClient, initializeSupabaseClient } from './client.js';

export * from './errorHandlers.js';

export * from './queryBuilder.js';

export * as TopicRepository from './repositories/topics.js';
export * as MessageRepository from './repositories/messages.js';
export * as PlanRepository from './repositories/plans.js';
export * as ProposalRepository from './repositories/proposals.js';
export * as VoteRepository from './repositories/votes.js';
export * as OrchestratorRepository from './repositories/orchestrator.js';
export * as ArbitrationRepository from './repositories/arbitration.js';

import { getSupabaseClient } from './client.js';
import * as TopicRepo from './repositories/topics.js';
import * as MessageRepo from './repositories/messages.js';
import * as PlanRepo from './repositories/plans.js';
import * as ProposalRepo from './repositories/proposals.js';
import * as VoteRepo from './repositories/votes.js';
import * as OrchestratorRepo from './repositories/orchestrator.js';
import * as ArbitrationRepo from './repositories/arbitration.js';

export class SupabaseService {
  private static instance: SupabaseService | null = null;

  private constructor() {}

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  createTopic = TopicRepo.createTopic;
  updateTopicState = TopicRepo.updateTopicState;
  endTopic = TopicRepo.endTopic;
  getCurrentTopic = TopicRepo.getCurrentTopic;

  insertMessage = MessageRepo.insertMessage;
  getRecentMessages = MessageRepo.getRecentMessages;
  getMessagesInCurrentTick = MessageRepo.getMessagesInCurrentTick;
  markMessageAsSelected = MessageRepo.markMessageAsSelected;

  createPlan = PlanRepo.createPlan;
  getPlan = PlanRepo.getPlan;
  getCurrentPlanContent = PlanRepo.getCurrentPlanContent;
  addPlanRevision = PlanRepo.addPlanRevision;
  markPlanAsAdopted = PlanRepo.markPlanAsAdopted;

  getProposal = ProposalRepo.getProposal;
  updateProposalStatus = ProposalRepo.updateProposalStatus;
  addToProposalQueue = ProposalRepo.addToProposalQueue;
  getNextQueuedProposal = ProposalRepo.getNextQueuedProposal;

  addAgentVote = VoteRepo.addAgentVote;
  getAgentVotes = VoteRepo.getAgentVotes;
  clearAgentVotes = VoteRepo.clearAgentVotes;

  tryAcquireOrchestratorLock = OrchestratorRepo.tryAcquireOrchestratorLock;
  refreshOrchestratorLock = OrchestratorRepo.refreshOrchestratorLock;
  releaseOrchestratorLock = OrchestratorRepo.releaseOrchestratorLock;
  getOrchestratorLockStatus = OrchestratorRepo.getOrchestratorLockStatus;

  logArbitration = ArbitrationRepo.logArbitration;

  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const { data, error } = await getSupabaseClient()
        .from('proposals')
        .select('id')
        .limit(1);

      if (error) {
        return { healthy: false, error: error.message };
      }

      return { healthy: true };
    } catch (error: any) {
      return { healthy: false, error: error.message };
    }
  }

  getClient() {
    return getSupabaseClient();
  }
}
