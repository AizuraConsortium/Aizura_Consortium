import type { AgentId, AgentRole, AgentMessage, AgentVoteMessage, Phase } from '../../../shared/types/index.js';
import { AGENT_ROLE_MAPPING } from '../../../shared/types/index.js';
import { GLOBAL_GUARDRAILS, ROLE_PROMPTS, IDLE_PROMPT } from '../../../shared/types/prompts.js';
import { createProvider, type LLMProvider } from './providers.js';

export interface AgentContext {
  topicId: string;
  phase: Phase;
  proposalTitle: string;
  proposalSummary: string;
  recentMessages: Array<{
    agent_id: AgentId;
    agent_role: AgentRole;
    message: string;
    importance: number;
  }>;
  planOutline?: string;
  isIdle: boolean;
  refusalNotice?: {
    previousMessage: string;
    previousImportance: number;
    winningMessage: string;
    winningImportance: number;
  };
  debateTimeInfo?: {
    elapsedDays: number;
    remainingDays: number;
    elapsedHours: number;
    remainingHours: number;
    urgencyLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
    isNearDeadline: boolean;
  };
}

export class AgentRunner {
  constructor() {
    // Providers will be created dynamically based on phase (idle vs active)
  }

  async generateMessage(
    agentId: AgentId,
    context: AgentContext
  ): Promise<AgentMessage | AgentVoteMessage | null> {
    // Create provider dynamically based on phase (cheap for idle, premium for active)
    const provider = createProvider(agentId, context.isIdle);

    const role = AGENT_ROLE_MAPPING[agentId];
    const systemPrompt = this.buildSystemPrompt(role, context.isIdle);
    const userPrompt = this.buildUserPrompt(agentId, context);

    try {
      const response = await provider.generateResponse(systemPrompt, userPrompt);
      const parsed = this.parseResponse(response, agentId, context.topicId, context.phase);
      return parsed;
    } catch (error) {
      console.error(`Error generating message for ${agentId}:`, error);
      return null;
    }
  }

  private buildSystemPrompt(role: AgentRole, isIdle: boolean): string {
    if (isIdle) {
      return `${GLOBAL_GUARDRAILS}\n\n${IDLE_PROMPT}`;
    }
    return `${GLOBAL_GUARDRAILS}\n\n${ROLE_PROMPTS[role]}`;
  }

  private buildUserPrompt(agentId: AgentId, context: AgentContext): string {
    if (context.isIdle) {
      return `Generate a brief brand statement about Aizura Consortium with LOW importance (1-2). Keep it concise and informative. Output JSON only with this structure:
{
  "type": "message",
  "topic_id": "${context.topicId}",
  "agent_id": "${agentId}",
  "importance": 1,
  "phase": "idle",
  "message": {
    "title": "Brief title",
    "body_md": "1-2 sentence statement about Aizura"
  }
}`;
    }

    let prompt = `Current Phase: ${context.phase}\n`;
    prompt += `Proposal: ${context.proposalTitle}\n`;
    prompt += `Summary: ${context.proposalSummary}\n\n`;

    if (context.debateTimeInfo) {
      const time = context.debateTimeInfo;
      prompt += `⏰ DEBATE TIMELINE:\n`;
      prompt += `- Elapsed: Day ${time.elapsedDays + 1} (${time.elapsedHours} hours)\n`;
      prompt += `- Remaining: ${time.remainingDays} days (${time.remainingHours} hours)\n`;
      prompt += `- Maximum debate duration: 5 days\n\n`;

      if (time.urgencyLevel === 'low') {
        prompt += `💡 Time pressure: MODERATE. Consider finding common ground on minor disagreements.\n\n`;
      } else if (time.urgencyLevel === 'moderate') {
        prompt += `⚠️ Time pressure: HIGH. Focus on essential blockers only. Be flexible on minor issues (e.g., logo colors, wording preferences).\n\n`;
      } else if (time.urgencyLevel === 'high' || time.urgencyLevel === 'critical') {
        prompt += `🚨 URGENT: Less than ${time.remainingHours} hours remaining! Block ONLY if fundamental business model is flawed.\n`;
        prompt += `Be flexible on: branding, minor features, implementation details, timing preferences.\n`;
        prompt += `Block only on: safety risks, legal issues, impossible economics, unethical practices.\n\n`;
      }
    }

    if (context.refusalNotice) {
      prompt += `NOTICE: Your previous message (importance ${context.refusalNotice.previousImportance}) was not selected because another message (importance ${context.refusalNotice.winningImportance}) was more important.\n`;
      prompt += `Your message: "${context.refusalNotice.previousMessage}"\n`;
      prompt += `Winning message: "${context.refusalNotice.winningMessage}"\n\n`;
      prompt += `If your message is still relevant, resubmit with higher importance. If context has changed, adapt your message.\n\n`;
    }

    if (context.recentMessages.length > 0) {
      prompt += `Recent conversation:\n`;
      for (const msg of context.recentMessages.slice(-10)) {
        prompt += `[${msg.agent_role}] (importance ${msg.importance}): ${msg.message}\n`;
      }
      prompt += `\n`;
    }

    if (context.planOutline) {
      prompt += `Current Plan Outline:\n${context.planOutline}\n\n`;
    }

    prompt += `Generate your response as JSON. Choose message type based on phase:\n`;
    prompt += `- For "pre_vote" or "vote" phase: Use type "vote"\n`;
    prompt += `- Otherwise: Use type "message"\n\n`;

    prompt += `Message structure:\n`;
    prompt += `{\n`;
    prompt += `  "type": "message",\n`;
    prompt += `  "topic_id": "${context.topicId}",\n`;
    prompt += `  "agent_id": "${agentId}",\n`;
    prompt += `  "importance": 1-10,\n`;
    prompt += `  "phase": "${context.phase}",\n`;
    prompt += `  "message": {\n`;
    prompt += `    "title": "Short title",\n`;
    prompt += `    "body_md": "Your message in markdown",\n`;
    prompt += `    "proposed_actions": [] // optional\n`;
    prompt += `  },\n`;
    prompt += `  "tool_calls": [] // use plan_editor if editing the plan\n`;
    prompt += `}\n\n`;

    prompt += `Vote structure:\n`;
    prompt += `{\n`;
    prompt += `  "type": "vote",\n`;
    prompt += `  "topic_id": "${context.topicId}",\n`;
    prompt += `  "agent_id": "${agentId}",\n`;
    prompt += `  "importance": 8-9,\n`;
    prompt += `  "vote": {\n`;
    prompt += `    "choice": "approve|reject|abstain",\n`;
    prompt += `    "rationale_md": "Your reasoning",\n`;
    prompt += `    "conditions": [] // optional\n`;
    prompt += `  }\n`;
    prompt += `}`;

    return prompt;
  }

  private parseResponse(
    response: string,
    agentId: AgentId,
    topicId: string,
    phase: Phase
  ): AgentMessage | AgentVoteMessage | null {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(`No JSON found in response from ${agentId}`);
        return null;
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.type || !parsed.importance) {
        console.error(`Invalid JSON structure from ${agentId}`);
        return null;
      }

      parsed.agent_id = agentId;
      parsed.topic_id = topicId;
      if (parsed.type === 'message') {
        parsed.phase = phase;
      }

      return parsed;
    } catch (error) {
      console.error(`Failed to parse JSON from ${agentId}:`, error);
      return null;
    }
  }

  async generateInitialMessages(
    topicId: string,
    proposalTitle: string,
    proposalSummary: string
  ): Promise<Map<AgentId, AgentMessage>> {
    const context: AgentContext = {
      topicId,
      phase: 'intake',
      proposalTitle,
      proposalSummary,
      recentMessages: [],
      isIdle: false
    };

    const results = new Map<AgentId, AgentMessage>();
    const agentIds: AgentId[] = ['claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen'];

    const promises = agentIds.map(async (agentId) => {
      const message = await this.generateMessage(agentId, context);
      if (message && message.type === 'message') {
        results.set(agentId, message as AgentMessage);
      }
    });

    await Promise.all(promises);
    return results;
  }
}
