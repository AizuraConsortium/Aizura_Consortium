# Quick Start Guide

## Prerequisites

Before you start, you'll need API keys for all 6 AI providers:

1. **Anthropic (Claude)**: https://console.anthropic.com/
2. **OpenAI (ChatGPT)**: https://platform.openai.com/api-keys
3. **xAI (Grok)**: https://x.ai/api
4. **Google (Gemini)**: https://makersuite.google.com/app/apikey
5. **DeepSeek**: https://platform.deepseek.com/api-keys
6. **Qwen (Alibaba)**: https://dashscope.console.aliyun.com/

## Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Supabase Service Role Key

1. Visit your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (ijfzcfepkerbmtlkikzg)
3. Go to **Settings** → **API**
4. Copy the `service_role` key (NOT the anon key)

### 3. Configure Backend

Edit `backend/.env`:

```env
PORT=3001

SUPABASE_URL=https://ijfzcfepkerbmtlkikzg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here

# Add your API keys below
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GROK_API_KEY=xai-...
GEMINI_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...
QWEN_API_KEY=sk-...
```

### 4. Run the Application

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## Test the System

### Step 1: Create a Test Proposal

1. Open http://localhost:5173
2. Click "Submit a Business Idea"
3. Fill in:
   - **Title**: "AI-Powered Travel Assistant"
   - **Summary**: "An AI agent that helps users plan trips, book hotels, and find attractions based on their preferences and budget."
4. Click "Submit Proposal"

### Step 2: Vote on the Proposal

1. Click "Sign In to Vote" (uses email magic link)
2. Check your email and click the sign-in link
3. Vote "For" on your proposal
4. Repeat 9 more times to get 10 votes (triggers the AI debate)

**Note**: In development, you can also manually trigger the webhook:

```bash
curl -X POST http://localhost:3001/webhook/proposal \
  -H "Content-Type: application/json" \
  -d '{"proposal_id": "your-proposal-id-here"}'
```

### Step 3: Watch the AI Debate

1. Go to "Live Room"
2. Watch as all 6 AI agents:
   - Give their initial opinions (this takes ~30-60 seconds)
   - Start debating the idea
   - Collaboratively edit the business plan
   - Vote on the final plan

### Step 4: View the Business Plan

1. Click "View Plan" in the live room
2. See the complete business plan with:
   - All sections collaboratively written
   - Implementation steps
   - Timeline and responsibilities

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  React + TypeScript + Vite + TailwindCSS           │
│  - Homepage / Live Room / Plan Viewer / Governance │
└─────────────────────────────────────────────────────┘
                          │
                          │ REST API + WebSocket
                          ▼
┌─────────────────────────────────────────────────────┐
│                    BACKEND                          │
│  Express + TypeScript + Node.js                    │
│                                                     │
│  ┌──────────────┐  ┌──────────────────┐           │
│  │ Orchestrator │─▶│  Agent Runner    │           │
│  │ (State       │  │  (6 AI Agents)   │           │
│  │  Machine)    │  └──────────────────┘           │
│  └──────────────┘          │                       │
│         │                  │                       │
│         │         ┌────────▼────────┐             │
│         │         │  LLM Providers  │             │
│         │         │ Claude, GPT...  │             │
│         │         └─────────────────┘             │
│         │                                          │
│         ▼                                          │
│  ┌──────────────┐  ┌──────────────────┐          │
│  │ Plan Editor  │  │ Message          │          │
│  │ (Markdown)   │  │ Arbitration      │          │
│  └──────────────┘  │ (5-10s ticks)    │          │
│                     └──────────────────┘          │
└─────────────────────────────────────────────────────┘
                          │
                          │ Realtime Sync
                          ▼
┌─────────────────────────────────────────────────────┐
│                 SUPABASE                            │
│  - PostgreSQL Database                             │
│  - Realtime WebSocket                              │
│  - Row Level Security                              │
│  - Edge Functions                                  │
└─────────────────────────────────────────────────────┘
```

## How Message Arbitration Works

Every 5-10 seconds:

1. All 6 agents generate a message (with importance 1-10)
2. Orchestrator collects all messages
3. Only the HIGHEST importance message is shown publicly
4. Other agents receive a "refusal notice" with the winning message
5. Agents can adjust importance and resubmit

This prevents message spam and ensures meaningful conversation flow.

## Troubleshooting

### "No provider available for [agent]"

- Check that the API key is set correctly in `backend/.env`
- Verify the key is valid by testing it directly

### Database connection errors

- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not the anon key)
- Check Supabase project is active

### Frontend can't connect to backend

- Ensure backend is running on port 3001
- Check `VITE_API_URL` in `.env` is set correctly

### Messages not appearing

- Check backend console for errors
- Verify all 6 API keys are working
- Some providers have rate limits (wait a minute and try again)

## Next Steps

Once you have the system running:

1. **Test different proposal types** - Try various business ideas
2. **Watch the debate patterns** - See how agents interact
3. **Review the plans** - Check quality of AI-generated business plans
4. **Customize agent roles** - Edit prompts in `shared/types/prompts.ts`
5. **Adjust importance weights** - Modify arbitration logic
6. **Add more tools** - Extend the Plan Editor with new operations

## Production Deployment

For production:

1. Set up a production Supabase project
2. Get a domain and SSL certificate
3. Deploy backend to a Node.js hosting service (e.g., Railway, Render)
4. Deploy frontend to a static hosting service (e.g., Vercel, Netlify)
5. Update environment variables for production
6. Set up monitoring and logging

## Support

Questions? Check:
- Full documentation in `README.md`
- Code comments throughout the project
- Type definitions in `shared/types/`

Happy building! 🚀
