import type { AgentId, AgentMessage, AgentVoteMessage, Phase, Topic } from '../../../shared/types/index.js';
import { AGENT_ROLE_MAPPING } from '../../../shared/types/index.js';
import { AgentRunner, type AgentContext } from '../agents/runner.js';
import { SupabaseService } from '../services/supabase.js';
import { PlanEditor } from '../services/planEditor.js';
import { PhaseValidator } from './phaseValidator.js';

const ACTIVE_TICK_INTERVAL = 90000; // 90 seconds for active debates
const IDLE_TICK_INTERVAL = 420000; // 7 minutes for idle mode
const AGENT_IDS: AgentId[] = ['chatgpt', 'deepseek', 'grok', 'claude', 'gemini', 'qwen'];
const MAX_VOTE_ATTEMPTS = 3;
const MAX_DEBATE_DURATION_MS = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
const MAX_DEBATE_DURATION_HOURS = 96; // 4 days

export class Orchestrator {
  private agentRunner: AgentRunner;
  private supabase: SupabaseService;
  private planEditor: PlanEditor;
  private tickTimer: NodeJS.Timeout | null = null;
  private currentTopic: Topic | null = null;
  private pendingMessages: Map<AgentId, AgentMessage | AgentVoteMessage> = new Map();
  private refusalNotices: Map<AgentId, { notice: any; expiresAfterTick: number }> = new Map();
  private isInitializing: boolean = false;
  private isProcessingTick: boolean = false;
  private currentTickInterval: number = ACTIVE_TICK_INTERVAL;
  private voteAttemptCount: number = 0;
  private idleMessageCount: number = 0;
  private lastIdleMessageTime: number = 0;
  private tickCount: number = 0;

  constructor() {
    this.agentRunner = new AgentRunner();
    this.supabase = SupabaseService.getInstance();
    this.planEditor = new PlanEditor();
  }

  async start(): Promise<void> {
    console.log('🚀 Orchestrator starting...');

    this.currentTopic = await this.supabase.getCurrentTopic();

    if (!this.currentTopic) {
      console.log('📭 No active topic. Entering idle mode.');
      await this.enterIdleMode();
    } else {
      console.log(`📝 Resuming topic: ${this.currentTopic.id} (state: ${this.currentTopic.state})`);
    }

    this.startTicker();
  }

  async handleNewProposal(proposalId: string): Promise<void> {
    console.log(`📨 New proposal received: ${proposalId}`);

    if (this.currentTopic && !this.currentTopic.ended_at) {
      console.log('⚠️ Already processing a topic. Adding to queue.');
      await this.supabase.addToProposalQueue(proposalId);
      return;
    }

    // Exit idle mode if active
    if (this.currentTopic && this.currentTopic.state === 'idle') {
      await this.supabase.endTopic(this.currentTopic.id);
      this.idleMessageCount = 0;
    }

    const proposal = await this.supabase.getProposal(proposalId);

    await this.supabase.updateProposalStatus(proposalId, 'in_debate');

    const topic = await this.supabase.createTopic(proposalId);
    this.currentTopic = topic;
    this.voteAttemptCount = 0;

    // Switch to active tick interval
    this.updateTickInterval(ACTIVE_TICK_INTERVAL);

    const initialPlan = this.planEditor.initializePlan(proposal.title);
    await this.supabase.createPlan(topic.id, proposal.title, initialPlan);

    console.log(`🎬 Starting debate on: ${proposal.title}`);
    await this.initializeDebate(proposal.title, proposal.summary || '');
  }

  private async initializeDebate(title: string, summary: string): Promise<void> {
    if (!this.currentTopic) return;

    this.isInitializing = true;
    console.log('⏳ Collecting initial responses from all agents...');

    const initialMessages = await this.agentRunner.generateInitialMessages(
      this.currentTopic.id,
      title,
      summary
    );

    for (const [agentId, message] of initialMessages) {
      const role = AGENT_ROLE_MAPPING[agentId];
      await this.supabase.insertMessage(
        this.currentTopic.id,
        agentId,
        role,
        'intake',
        message.importance,
        message,
        true
      );

      console.log(`✅ ${agentId} (importance ${message.importance}): ${message.message.title}`);
    }

    await this.transitionPhase('debate');

    this.isInitializing = false;
    console.log('🎭 All agents have responded. Debate begins!');
  }

  private async enterIdleMode(): Promise<void> {
    // Check for queued proposals first
    const nextProposal = await this.supabase.getNextQueuedProposal();
    if (nextProposal) {
      console.log('📋 Processing next queued proposal...');
      await this.handleNewProposal(nextProposal.id);
      return;
    }

    // Enter idle mode with slower tick rate
    this.updateTickInterval(IDLE_TICK_INTERVAL);
    this.idleMessageCount = 0;
    this.lastIdleMessageTime = Date.now();

    const idleTopic = await this.supabase.createTopic('00000000-0000-0000-0000-000000000000');
    this.currentTopic = idleTopic;
    await this.transitionPhase('idle');

    console.log('😴 Entered idle mode (1 message per 7 minutes)');
  }

  private startTicker(): void {
    this.tickTimer = setInterval(() => {
      this.tick().catch(err => console.error('Tick error:', err));
    }, this.currentTickInterval);

    console.log(`⏰ Ticker started (${this.currentTickInterval}ms interval)`);
  }

  private updateTickInterval(newInterval: number): void {
    if (this.currentTickInterval === newInterval) return;

    this.currentTickInterval = newInterval;

    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.startTicker();
      console.log(`⏰ Tick interval updated to ${newInterval}ms`);
    }
  }

  private async tick(): Promise<void> {
    if (!this.currentTopic || this.isInitializing || this.isProcessingTick) return;

    // Check for queued proposals when in idle mode
    if (this.currentTopic.state === 'idle') {
      const nextProposal = await this.supabase.getNextQueuedProposal();
      if (nextProposal) {
        console.log('📋 Found queued proposal in idle tick, exiting idle mode...');
        await this.handleNewProposal(nextProposal.id);
        return;
      }

      // Rate limit idle messages to max 10 per hour
      const hoursSinceStart = (Date.now() - this.lastIdleMessageTime) / (1000 * 60 * 60);
      if (this.idleMessageCount >= 10 && hoursSinceStart < 1) {
        return;
      }
      if (hoursSinceStart >= 1) {
        this.idleMessageCount = 0;
        this.lastIdleMessageTime = Date.now();
      }
    }

    // Check for debate timeout (4-day maximum)
    if (this.currentTopic.state !== 'idle' && !this.isInitializing) {
      const timeInfo = this.calculateDebateTimeInfo(this.currentTopic.started_at);

      if (timeInfo.isExpired) {
        console.log('⏰ 4-DAY TIMEOUT REACHED! Forcing final vote...');

        // Force transition to vote phase if not already there
        if (this.currentTopic.state !== 'vote') {
          await this.supabase.updateTopicState(this.currentTopic.id, 'vote');
          this.currentTopic.state = 'vote';
          console.log('🗳️  Transitioned to FINAL VOTE due to timeout');
        }

        // Check if we already have votes
        const allVotes = await this.supabase.getAgentVotes(this.currentTopic.id);

        // If all 6 votes are in, process them immediately
        if (allVotes.length === 6) {
          console.log('📊 All votes collected. Processing final results...');
          await this.processVoteResults(allVotes);
          return;
        }

        // If timeout exceeded by more than 1 hour and still no complete votes, force rejection
        if (timeInfo.elapsedHours > MAX_DEBATE_DURATION_HOURS + 1) {
          console.log('❌ TIMEOUT EXCEEDED BY 1+ HOUR. No consensus reached. Forcing rejection.');
          if (this.currentTopic.proposal_id) {
            await this.supabase.updateProposalStatus(this.currentTopic.proposal_id, 'rejected');
          }
          await this.supabase.endTopic(this.currentTopic.id);
          this.currentTopic = null;
          await this.enterIdleMode();
          return;
        }
      }
    }

    this.isProcessingTick = true;
    this.tickCount++;

    try {
      for (const agentId of AGENT_IDS) {
        const context = await this.buildContext();

        const agentContext = {
          ...context,
          refusalNotice: this.getRefusalNotice(agentId)
        };

        const message = await this.agentRunner.generateMessage(agentId, agentContext);

        if (message) {
          this.pendingMessages.set(agentId, message);

          const role = AGENT_ROLE_MAPPING[agentId];
          const phase = this.currentTopic!.state;

          await this.supabase.insertMessage(
            this.currentTopic!.id,
            agentId,
            role,
            phase,
            message.importance,
            message,
            false
          );

          console.log(`   💬 [${agentId}] (${message.importance}): ${this.getMessageTitle(message)}`);
        }
      }

      await this.arbitrateMessages();

      // Increment idle message counter
      if (this.currentTopic?.state === 'idle') {
        this.idleMessageCount++;
      }
    } finally {
      this.isProcessingTick = false;
    }
  }

  private async buildContext(): Promise<AgentContext> {
    if (!this.currentTopic) {
      throw new Error('No current topic');
    }

    const isIdle = this.currentTopic.state === 'idle';

    if (isIdle) {
      return {
        topicId: this.currentTopic.id,
        phase: 'idle',
        proposalTitle: '',
        proposalSummary: '',
        recentMessages: [],
        isIdle: true
      };
    }

    if (!this.currentTopic.proposal_id) {
      throw new Error('Cannot build context for topic without proposal');
    }

    const proposal = await this.supabase.getProposal(this.currentTopic.proposal_id);
    const recentMessages = await this.supabase.getRecentMessages(this.currentTopic.id, 10);
    const planContent = await this.supabase.getCurrentPlanContent(this.currentTopic.id);

    const planOutline = this.extractOutline(planContent);
    const timeInfo = this.calculateDebateTimeInfo(this.currentTopic.started_at);

    return {
      topicId: this.currentTopic.id,
      phase: this.currentTopic.state,
      proposalTitle: proposal.title,
      proposalSummary: proposal.summary || '',
      recentMessages: recentMessages.reverse().map(msg => ({
        agent_id: msg.agent_id,
        agent_role: msg.agent_role,
        message: (msg.body as any).message?.title || (msg.body as any).vote?.choice || '',
        importance: msg.importance
      })),
      planOutline,
      isIdle: false,
      debateTimeInfo: {
        elapsedDays: timeInfo.elapsedDays,
        remainingDays: timeInfo.remainingDays,
        elapsedHours: Math.floor(timeInfo.elapsedHours),
        remainingHours: Math.floor(timeInfo.remainingHours),
        urgencyLevel: timeInfo.urgencyLevel,
        isNearDeadline: timeInfo.remainingHours < 24
      }
    };
  }

  private extractOutline(planMd: string): string {
    const lines = planMd.split('\n');
    const outlineLines = lines.filter(line => line.trim().startsWith('#'));
    return outlineLines.join('\n');
  }

  private async arbitrateMessages(): Promise<void> {
    if (this.pendingMessages.size === 0) return;

    const candidates = Array.from(this.pendingMessages.entries());

    candidates.sort((a, b) => {
      const importanceDiff = b[1].importance - a[1].importance;
      if (importanceDiff !== 0) return importanceDiff;

      return 0;
    });

    const [winnerAgentId, winnerMessage] = candidates[0];

    const messages = await this.supabase.getMessagesInCurrentTick(
      this.currentTopic!.id,
      Array.from(this.pendingMessages.keys())
    );

    const winnerDbMessage = messages.find(m => m.agent_id === winnerAgentId);

    if (winnerDbMessage) {
      await this.supabase.markMessageAsSelected(winnerDbMessage.id);

      await this.supabase.logArbitration(
        this.currentTopic!.id,
        winnerDbMessage.id,
        { importance: winnerMessage.importance, candidateCount: candidates.length }
      );
    }

    console.log(`🏆 [${winnerAgentId}] (${winnerMessage.importance}): ${this.getMessageTitle(winnerMessage)}`);

    for (const [agentId, message] of candidates) {
      if (agentId !== winnerAgentId) {
        this.refusalNotices.set(agentId, {
          notice: {
            previousMessage: this.getMessageTitle(message),
            previousImportance: message.importance,
            winningMessage: this.getMessageTitle(winnerMessage),
            winningImportance: winnerMessage.importance
          },
          expiresAfterTick: this.tickCount + 5 // Expire after 5 ticks (~7.5 minutes)
        });

        console.log(`   ❌ [${agentId}] (${message.importance}) - not selected`);
      } else {
        this.refusalNotices.delete(agentId);
      }
    }

    await this.handleToolCalls(winnerMessage);

    if (winnerMessage.type === 'vote') {
      await this.handleVote(winnerAgentId, winnerMessage as AgentVoteMessage);
    }

    this.pendingMessages.clear();
  }

  private getMessageTitle(message: AgentMessage | AgentVoteMessage): string {
    if (message.type === 'message') {
      return (message as AgentMessage).message.title;
    }
    return `Vote: ${(message as AgentVoteMessage).vote.choice}`;
  }

  private async handleToolCalls(message: AgentMessage | AgentVoteMessage): Promise<void> {
    if (message.type !== 'message' || !message.tool_calls) return;

    const agentMessage = message as AgentMessage;

    for (const toolCall of agentMessage.tool_calls) {
      if (toolCall.tool === 'plan_editor') {
        await this.applyPlanEdit(agentMessage.agent_id, toolCall.args);
      }
    }
  }

  private async applyPlanEdit(agentId: AgentId, args: any): Promise<void> {
    const plan = await this.supabase.getPlan(this.currentTopic!.id);
    if (!plan) return;

    const currentContent = await this.supabase.getCurrentPlanContent(this.currentTopic!.id);

    const result = this.planEditor.applyEdit(currentContent, args, agentId);

    await this.supabase.addPlanRevision(
      plan.id,
      agentId,
      args.op,
      args.path,
      result.planMd,
      result.diff
    );

    console.log(`   📝 Plan edited: ${args.op} at ${args.path} (+${result.diff.addedChars} chars)`);
  }

  private async handleVote(agentId: AgentId, voteMessage: AgentVoteMessage): Promise<void> {
    await this.supabase.addAgentVote(
      this.currentTopic!.id,
      agentId,
      voteMessage.vote.choice,
      voteMessage.vote.rationale_md,
      voteMessage.vote.conditions || []
    );

    const allVotes = await this.supabase.getAgentVotes(this.currentTopic!.id);

    console.log(`   🗳️  Vote count: ${allVotes.length}/6`);

    if (allVotes.length === 6) {
      await this.processVoteResults(allVotes);
    }
  }

  private async processVoteResults(votes: any[]): Promise<void> {
    const approvals = votes.filter(v => v.choice === 'approve');

    console.log(`\n🎯 Final vote: ${approvals.length}/6 approved (Attempt ${this.voteAttemptCount + 1}/${MAX_VOTE_ATTEMPTS})\n`);

    if (approvals.length === 6) {
      console.log('✅ UNANIMOUS APPROVAL! Plan adopted.');

      const plan = await this.supabase.getPlan(this.currentTopic!.id);
      if (plan) {
        await this.supabase.markPlanAsAdopted(plan.id);
      }

      if (this.currentTopic!.proposal_id) {
        await this.supabase.updateProposalStatus(this.currentTopic!.proposal_id, 'adopted');
      }
      await this.supabase.endTopic(this.currentTopic!.id);

      this.currentTopic = null;
      await this.enterIdleMode();
    } else {
      this.voteAttemptCount++;

      if (this.voteAttemptCount >= MAX_VOTE_ATTEMPTS) {
        console.log(`❌ Vote failed ${MAX_VOTE_ATTEMPTS} times. Rejecting proposal.`);

        if (this.currentTopic!.proposal_id) {
          await this.supabase.updateProposalStatus(this.currentTopic!.proposal_id, 'rejected');
        }
        await this.supabase.endTopic(this.currentTopic!.id);

        this.currentTopic = null;
        await this.enterIdleMode();
      } else {
        console.log('❌ Vote failed. Returning to plan_drafting phase for revisions.');

        // Clear all votes to allow fresh voting after plan updates
        await this.supabase.clearAgentVotes(this.currentTopic!.id);

        await this.transitionPhase('plan_drafting');

        // After some plan updates, automatically transition back to pre_vote
        // This will be handled by agents transitioning the phase
      }
    }
  }

  private calculateDebateTimeInfo(startedAt: string): {
    elapsedMs: number;
    elapsedHours: number;
    elapsedDays: number;
    remainingMs: number;
    remainingHours: number;
    remainingDays: number;
    isExpired: boolean;
    urgencyLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  } {
    const startTime = new Date(startedAt).getTime();
    const currentTime = Date.now();
    const elapsedMs = currentTime - startTime;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    const remainingMs = MAX_DEBATE_DURATION_MS - elapsedMs;
    const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60));
    const remainingDays = Math.max(0, Math.ceil(remainingHours / 24));

    const isExpired = elapsedMs >= MAX_DEBATE_DURATION_MS;

    let urgencyLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical' = 'none';
    if (elapsedHours < 24) urgencyLevel = 'none';
    else if (elapsedHours < 48) urgencyLevel = 'low';
    else if (elapsedHours < 72) urgencyLevel = 'moderate';
    else if (elapsedHours < 84) urgencyLevel = 'high';
    else urgencyLevel = 'critical';

    return {
      elapsedMs,
      elapsedHours,
      elapsedDays,
      remainingMs,
      remainingHours,
      remainingDays,
      isExpired,
      urgencyLevel
    };
  }

  private async transitionPhase(newPhase: Phase): Promise<boolean> {
    if (!this.currentTopic) {
      console.warn('⚠️  Cannot transition phase: No current topic');
      return false;
    }

    const currentPhase = this.currentTopic.state;

    if (currentPhase === newPhase) {
      console.warn(`⚠️  Already in phase: ${currentPhase}`);
      return false;
    }

    const validation = PhaseValidator.validateTransition(currentPhase, newPhase);

    if (!validation.valid) {
      console.warn(`⚠️  ${validation.error}`);
      return false;
    }

    await this.supabase.updateTopicState(this.currentTopic.id, newPhase);
    this.currentTopic.state = newPhase;
    console.log(`📍 Phase transition: ${currentPhase} → ${newPhase}`);
    return true;
  }

  private getRefusalNotice(agentId: AgentId): any {
    const entry = this.refusalNotices.get(agentId);
    if (!entry) return undefined;

    // Check if expired
    if (this.tickCount > entry.expiresAfterTick) {
      this.refusalNotices.delete(agentId);
      return undefined;
    }

    return entry.notice;
  }

  async stop(): Promise<void> {
    console.log('🛑 Stopping orchestrator...');

    // Wait for current tick to complete
    let waitCount = 0;
    while (this.isProcessingTick && waitCount < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      waitCount++;
    }

    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }

    console.log('🛑 Orchestrator stopped cleanly');
  }
}
