import { create } from '../../shared/services/supabase/queryBuilder.js';
import type { ArbitrationEntry } from '../../../shared/types/models.js';

export interface ArbitrationDecision {
  winnerImportance: number;
  candidateCount: number;
  runnerUpImportance?: number;
  metadata?: Record<string, any>;
}

export async function logArbitration(
  topicId: string,
  winnerMessageId: string,
  decision: ArbitrationDecision
): Promise<ArbitrationEntry> {
  return create<ArbitrationEntry>('arbitration', {
    topic_id: topicId,
    winner_message_id: winnerMessageId,
    winner_importance: decision.winnerImportance,
    candidate_count: decision.candidateCount,
    runner_up_importance: decision.runnerUpImportance || null,
    decision_metadata_json: decision.metadata || null
  });
}
