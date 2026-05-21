import { getSupabaseClient } from './client.js';
import * as TopicRepo from '../../../consortium/repositories/topics.js';
import * as MessageRepo from '../../../consortium/repositories/messages.js';
import * as PlanRepo from '../../../consortium/repositories/plans.js';
import * as ProposalRepo from '../../../consortium/repositories/proposals.js';
import * as VoteRepo from '../../../consortium/repositories/votes.js';
import * as OrchestratorRepo from './repositories/orchestrator.js';
import * as ArbitrationRepo from '../../../consortium/repositories/arbitration.js';

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
  getAgentVoteConditions = VoteRepo.getAgentVoteConditions;
  clearAgentVotes = VoteRepo.clearAgentVotes;

  tryAcquireOrchestratorLock = OrchestratorRepo.tryAcquireOrchestratorLock;
  refreshOrchestratorLock = OrchestratorRepo.refreshOrchestratorLock;
  releaseOrchestratorLock = OrchestratorRepo.releaseOrchestratorLock;
  getOrchestratorLockStatus = OrchestratorRepo.getOrchestratorLockStatus;

  logArbitration = ArbitrationRepo.logArbitration;

  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const { error } = await getSupabaseClient()
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
