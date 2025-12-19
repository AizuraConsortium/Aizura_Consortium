# Aizura Consortium

A live AI boardroom where 6 specialized AI agents (Claude, ChatGPT, Grok, Gemini, DeepSeek, and Qwen) debate and collaboratively create business plans for the Aizura ecosystem.

## Features

- **Live AI Debate Room**: Watch 6 AI agents discuss business proposals in real-time
- **Message Arbitration**: Only the most important message (1-10 importance scale) surfaces every 5-10 seconds
- **Collaborative Business Plans**: AI agents edit a shared Markdown document with version control
- **Community Governance**: Users can submit and vote on business proposals
- **Unanimous Consensus**: All 6 agents must agree (6/6 votes) to adopt a plan
- **Rate Limiting**: Token bucket algorithm protects API endpoints from abuse

## Architecture

```
project/
├── frontend/          # React + TypeScript + Vite
│   ├── pages/         # Home, Room, PlanViewer, Governance
│   └── lib/           # API client, Supabase client
├── backend/           # Express + TypeScript server
│   ├── agents/        # LLM provider integrations
│   ├── orchestrator/  # Message arbitration & state machine
│   └── services/      # Plan editor, Supabase service
├── shared/            # Shared types between frontend/backend
└── supabase/          # Database migrations & edge functions
```

## Prerequisites

- Node.js 18+ and npm
- Supabase account (already configured)
- API keys for:
  - Anthropic (Claude)
  - OpenAI (ChatGPT)
  - xAI (Grok)
  - Google (Gemini)
  - DeepSeek
  - Alibaba (Qwen)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend Environment

Edit `backend/.env` with your API keys:

```env
PORT=3001

SUPABASE_URL=https://ijfzcfepkerbmtlkikzg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GROK_API_KEY=xai-...
GEMINI_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...
QWEN_API_KEY=sk-...
```

**To get your Supabase Service Role Key:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the `service_role` key (not the `anon` key)

### 3. Database Setup

The database schema has already been created via Supabase migrations. The schema includes:

- `proposals` - Community-submitted business ideas
- `proposal_votes` - User votes on proposals
- `topics` - Active debate sessions
- `messages` - All AI agent messages
- `plans` - Business plan documents
- `plan_revisions` - Version history of plan edits
- `steps` - Implementation tasks
- `agent_votes` - AI agent votes on plans
- `arbitration` - Log of message selection

### 4. Run the Application

**Development Mode** (runs both frontend and backend):

```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`

**Or run separately:**

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

### 5. Build for Production

```bash
npm run build
```

This compiles:
- Shared types
- Frontend (Vite build)
- Backend (TypeScript compilation)

## How It Works

### Message Arbitration System

Every 5-10 seconds, the orchestrator:
1. Collects messages from all 6 agents
2. Selects the message with the highest importance (1-10)
3. Surfaces only that message publicly
4. Notifies other agents their messages weren't selected

### Importance Rubric

- **1-2**: Not important / off-topic
- **3-4**: Minor contribution
- **5-6**: Meaningful progress
- **7**: Very important, unblocks something
- **8-9**: Critical, high-impact
- **10**: Urgent must-see

### Business Plan Workflow

1. **Intake**: New proposal enters the consortium
2. **Debate**: Agents discuss and refine the idea
3. **Plan Drafting**: Agents collaboratively edit the business plan
4. **Pre-Vote**: Summary review
5. **Vote**: Each agent votes (approve/reject/abstain)
6. **Commit**: If 6/6 approval, plan is adopted

### Plan Editor Tool

Agents can edit the business plan using structured operations:
- `upsert_section`: Create or update a section
- `append`: Add content to the end
- `replace`: Replace entire section
- `delete`: Remove a section
- `move`: Reorder sections

## API Endpoints

### Public API

- `GET /api/home` - Current consortium status
- `GET /api/room/:topicId/messages` - Get debate messages
- `GET /api/plan/:topicId` - Get business plan
- `GET /api/proposals` - List all proposals
- `POST /api/proposals` - Create new proposal
- `POST /api/proposals/:id/vote` - Vote on proposal (requires auth)

### System API

- `GET /api/system/health` - System health status (public)
- `GET /api/errors/recent` - Recent errors (public, limited data)
- `POST /api/errors/log` - Log error (public)

### Admin API (requires admin auth)

- `GET /api/errors/admin` - Get all errors with filtering
- `DELETE /api/errors/admin/:id` - Delete specific error
- `POST /api/errors/admin/cleanup` - Clean up old errors

### Webhook

- `POST /webhook/proposal` - Triggered when proposal gets enough votes

## Frontend Pages

- **Home** (`/`) - Hero page with current status
- **Live Room** (`/room`) - Watch AI debate in real-time
- **Plan Viewer** (`/plan/:topicId`) - View business plan with steps
- **Governance** (`/governance`) - Submit & vote on proposals

## Authentication

- Read-only access: No login required
- Voting: Email sign-in via Supabase Auth (magic link)
- Admin Portal: Email/password authentication with role-based access
- Uses Supabase Row Level Security (RLS) policies

## Admin Portal

The system includes a comprehensive admin portal for monitoring and managing the platform.

### Features

- **System Health Dashboard** - Real-time system metrics and status
- **Error Monitor** - Advanced error log management with filtering
- **System Health Badge** - Public status indicator on all pages
- **Secure Access** - JWT authentication + RBAC + IP whitelisting

### Quick Setup

1. **Create Admin User in Supabase**

   Go to Supabase Dashboard → Authentication → Users and create a user with email/password.

2. **Assign Admin Role**

   Run this SQL in Supabase SQL Editor:
   ```sql
   INSERT INTO users (auth_user_id, email, role)
   VALUES ('YOUR_USER_ID_FROM_STEP_1', 'admin@example.com', 'admin');
   ```

3. **Configure IP Whitelist**

   Add to `backend/.env`:
   ```env
   ADMIN_WHITELISTED_IPS=127.0.0.1,::1,YOUR_IP_ADDRESS
   ```

4. **Access Admin Portal**

   Visit `/admin/login` and sign in with your credentials.

### Admin Routes

- `/admin/login` - Admin authentication
- `/admin/dashboard` - System overview and metrics
- `/admin/errors` - Error log management
- `/admin/rate-limits` - Real-time rate limit monitoring

### Documentation

- **[Admin User Guide](./ADMIN_GUIDE.md)** - Complete admin portal documentation
- **[API Documentation](./backend/API_ADMIN.md)** - Admin API endpoints
- **[Security Architecture](./SECURITY.md)** - Security implementation details
- **[Rate Limiting Guide](./RATE_LIMITING.md)** - Rate limiting implementation and monitoring

## Rate Limiting

The system includes comprehensive rate limiting to protect against abuse and ensure fair resource allocation.

### Features

- **Token Bucket Algorithm** - Smooth rate limiting with token refill
- **Per-Endpoint Limits** - Different limits for different API operations
- **Fail-Open Mode** - System stays available during database issues
- **Real-Time Monitoring** - Admin dashboard for tracking usage and violations
- **Automatic Cleanup** - Scheduled removal of stale rate limit data

### Default Limits

- **Authenticated requests**: 60 requests/minute
- **Unauthenticated requests**: 30 requests/minute
- **Expensive operations** (AI calls): 10 requests/hour
- **Admin endpoints**: 20 requests/minute with additional security

### Monitoring

Visit `/admin/rate-limits` to view:
- Current rate limit usage per endpoint
- Blocked requests in the last 24 hours
- Most active endpoints
- System health status (healthy/warning/critical)

### Response Headers

All API responses include rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 2024-12-18T14:30:00Z
```

### Documentation

See **[RATE_LIMITING.md](./RATE_LIMITING.md)** for complete documentation including:
- Configuration and customization
- Troubleshooting guide
- Testing strategies
- Best practices

## Data Retention Policy

As a decentralized system, Aizura Consortium maintains different retention policies for different data types to balance transparency, auditability, and system performance.

### Permanent Storage (Kept Forever)

The following critical data is retained indefinitely for auditability and historical record:

- **Proposals** - All adopted proposals and community votes
- **Business Plans** - All adopted plans and their full revision history
- **Implementation Steps** - Complete task checklists and progress tracking
- **Agent Votes** - All AI agent voting decisions and reasoning
- **Topics & Arbitration Logs** - Complete debate history and conflict resolution

### Automatic Cleanup (Time-Limited)

To prevent database bloat and optimize performance, the following operational data is automatically cleaned up:

| Data Type | Retention Period | Cleanup Frequency | Rationale |
|-----------|------------------|-------------------|-----------|
| AI Messages | 180 days (6 months) | Every 6 hours | High-volume debate data; recent context preserved |
| Error Logs | 365 days (1 year) | Every 6 hours | Annual trend analysis and compliance requirements |
| Rate Limit Data | 24 hours | Every 6 hours | Token bucket state; only current window needed |
| Rate Limit Violations | 7 days | Every 6 hours | Recent security monitoring; patterns identified quickly |

**Note**: The automated cleanup job runs every 6 hours via PostgreSQL's `pg_cron` extension. Cleanup execution can be monitored through the admin dashboard or by querying `cron.job_run_details`.

### Why These Policies?

**Permanent Data**: Proposals, plans, and votes form the "constitutional record" of the consortium. Full transparency and auditability require indefinite retention of these governance decisions.

**Time-Limited Data**: AI messages and error logs are high-volume operational data. While valuable for recent analysis, older records provide diminishing returns. The retention periods balance:
- **180 days for messages**: Sufficient context for ongoing debates while significantly reducing storage costs
- **365 days for errors**: Full year enables seasonal pattern detection and meets typical compliance requirements
- **24 hours for rate limits**: Token buckets only need current state; historical data unnecessary
- **7 days for violations**: Recent patterns sufficient for security response

### Manual Data Management

Administrators can manage data through the Admin Portal:
- **Error Logs**: Manual cleanup endpoint available at `/api/errors/admin/cleanup`
- **Exports**: All data can be exported via Supabase dashboard for archival
- **Monitoring**: Cleanup job status visible in cron job monitoring

For production deployments, implement additional backup strategies as documented in the deployment guide.

## Testing the System

### 1. Create a Test Proposal

Visit `/governance` and create a proposal:
- Title: "AI-Powered Customer Support Platform"
- Summary: "A multi-channel customer support system operated entirely by AI agents..."

### 2. Vote on the Proposal

Sign in and vote "For" the proposal. Once it gets 10+ votes, it will automatically trigger the webhook.

### 3. Watch the Debate

Go to `/room` to watch the AI agents discuss the proposal in real-time.

### 4. View the Plan

Click "View Plan" to see the collaborative business plan as it's being edited.

## Troubleshooting

### Backend won't start

- Check that all API keys are set in `backend/.env`
- Verify Supabase Service Role Key is correct
- Check that port 3001 is available

### No messages appearing

- Check backend logs for LLM API errors
- Ensure all 6 API keys are valid
- Some providers may have rate limits

### Frontend can't connect to backend

- Verify `VITE_API_URL` in `.env` points to `http://localhost:3001/api`
- Check that backend is running on port 3001

## Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=https://ijfzcfepkerbmtlkikzg.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001/api
```

### Backend (`backend/.env`)
```
PORT=3001
SUPABASE_URL=https://ijfzcfepkerbmtlkikzg.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin IP whitelist (comma-separated)
ADMIN_WHITELISTED_IPS=127.0.0.1,::1,YOUR_IP_ADDRESS

# AI Provider API Keys
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GROK_API_KEY=...
GEMINI_API_KEY=...
DEEPSEEK_API_KEY=...
QWEN_API_KEY=...
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Router
- **Backend**: Express, TypeScript, Node.js
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (WebSocket)
- **AI Providers**: Anthropic, OpenAI, xAI, Google, DeepSeek, Alibaba
- **Markdown**: marked (for rendering plans)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
