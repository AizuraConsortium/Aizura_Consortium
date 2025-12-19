import express from 'express';
import { SupabaseService } from '../services/supabase/index.js';
import { createRateLimit, validateProposal, validateVote, validatePagination } from '../middleware/validation.js';

const router = express.Router();
const supabase = SupabaseService.getInstance();

router.get('/home', createRateLimit('GET:/api/home'), async (req, res) => {
  try {
    const topic = await supabase.getCurrentTopic();

    if (!topic || !topic.proposal_id) {
      return res.json({
        status: 'idle',
        currentTopic: null
      });
    }

    const proposal = await supabase.getProposal(topic.proposal_id);
    const plan = await supabase.getPlan(topic.id);
    const votes = await supabase.getAgentVotes(topic.id);

    // Calculate time info for active debates
    let timeInfo = null;
    if (topic.state !== 'idle') {
      const elapsedMs = Date.now() - new Date(topic.started_at).getTime();
      const elapsedHours = elapsedMs / (1000 * 60 * 60);
      const remainingHours = Math.max(0, 120 - elapsedHours);

      timeInfo = {
        elapsedHours: Math.floor(elapsedHours),
        remainingHours: Math.floor(remainingHours),
        elapsedDays: Math.floor(elapsedHours / 24) + 1,
        remainingDays: Math.ceil(remainingHours / 24)
      };
    }

    res.json({
      status: 'active',
      currentTopic: {
        id: topic.id,
        proposal: {
          title: proposal.title,
          summary: proposal.summary
        },
        state: topic.state,
        voteProgress: `${votes.length}/6`,
        planId: plan?.id,
        timeInfo
      }
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/room/:topicId/messages', createRateLimit('GET:/api/room/:topicId/messages'), validatePagination(), async (req, res) => {
  try {
    const { topicId } = req.params;
    const limit = parseInt(req.query.limit as string);
    const offset = parseInt(req.query.offset as string);

    // Get total count
    const { count } = await supabase.getClient()
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('topic_id', topicId)
      .eq('selected', true);

    // Get paginated messages
    const { data: messages, error } = await supabase.getClient()
      .from('messages')
      .select('*')
      .eq('topic_id', topicId)
      .eq('selected', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      messages: messages?.reverse() || [],
      total: count || 0,
      offset,
      limit,
      hasMore: (count || 0) > offset + limit
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/plan/:topicId', createRateLimit('GET:/api/plan/:topicId'), async (req, res) => {
  try {
    const { topicId } = req.params;

    const plan = await supabase.getPlan(topicId);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const content = await supabase.getCurrentPlanContent(topicId);

    const { data: steps } = await supabase
      .getClient()
      .from('steps')
      .select('*')
      .eq('plan_id', plan.id)
      .order('created_at', { ascending: true });

    res.json({
      plan: {
        ...plan,
        content_md: content
      },
      steps: steps || []
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/proposals', createRateLimit('GET:/api/proposals'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .getClient()
      .from('proposals')
      .select('*')
      .neq('status', 'rejected')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ proposals: data });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/proposals', createRateLimit('POST:/api/proposals'), validateProposal, async (req, res) => {
  try {
    const { title, summary } = req.body;

    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.getClient().auth.getUser(token);
      userId = user?.id || null;
    }

    const { data, error } = await supabase
      .getClient()
      .from('proposals')
      .insert({
        title,
        summary,
        submitted_by: userId,
        status: 'queued',
        voting_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ proposal: data });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/proposals/:proposalId/vote', createRateLimit('POST:/api/proposals/:proposalId/vote'), validateVote, async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { vote } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.getClient().auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data, error } = await supabase
      .getClient()
      .from('proposal_votes')
      .upsert({
        proposal_id: proposalId,
        user_id: user.id,
        vote
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ vote: data });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
