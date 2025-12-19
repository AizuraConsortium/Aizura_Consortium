import { create } from '../queryBuilder.js';
import type { ArbitrationEntry } from '../../../../../shared/types/index.js';

export async function logArbitration(
  topicId: string,
  winnerMessageId: string,
  decision: any
): Promise<ArbitrationEntry> {
  return create<ArbitrationEntry>('arbitration', {
    topic_id: topicId,
    winner_message_id: winnerMessageId,
    decision
  });
}
