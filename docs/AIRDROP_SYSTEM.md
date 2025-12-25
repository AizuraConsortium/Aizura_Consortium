# AAIC Token Airdrop System
## Complete System Documentation & Point Economics

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Point Economics](#point-economics)
4. [User Flows](#user-flows)
5. [Admin Operations](#admin-operations)
6. [Anti-Sybil Detection](#anti-sybil-detection)
7. [Technical Implementation](#technical-implementation)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [Security](#security)

---

## Overview

### Purpose
The AAIC Token Airdrop system rewards community members for their engagement, contributions, and growth of the AAIC ecosystem. Users earn points through various activities, which determine their allocation of AAIC tokens when the airdrop occurs.

### Key Features
- **Multi-Channel Engagement**: Reward users for social media connections, content creation, and community participation
- **Referral Program**: Incentivize organic growth through milestone-based referral rewards
- **Content Submissions**: Reward high-quality content that promotes AAIC
- **Anti-Sybil Protection**: Advanced detection algorithms prevent gaming the system
- **Admin Dashboard**: Comprehensive tools for content review and user management
- **Real-Time Leaderboard**: Public leaderboard shows top contributors
- **Transparent Points**: Users can track all point-earning activities

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   User Portal   │ (React SPA)
│  /app/airdrop   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Admin Panel    │────▶│  Backend API     │
│ /admin/airdrop  │     │  (Express + TS)  │
└─────────────────┘     └────────┬─────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Supabase DB    │
                        │  + Row Level    │
                        │    Security     │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  OAuth          │
                        │  Providers      │
                        │ (Twitter, etc)  │
                        └─────────────────┘
```

### Components

**Frontend (Client Portal)**
- Dashboard widget showing airdrop stats
- Full airdrop page with tabs:
  - Overview & Stats
  - Social Connections
  - Content Submissions
  - Referrals
  - Leaderboard
- Real-time updates
- Responsive design

**Frontend (Admin Panel)**
- Content review queue
- User lookup & management
- Analytics dashboard
- Flagged users review
- Manual point adjustments

**Backend Services**
- Express.js API server
- OAuth integration (Twitter, Discord, Telegram, GitHub)
- Point calculation engine
- Anti-Sybil detection system
- Daily cron jobs
- Rate limiting
- Input sanitization

**Database (Supabase)**
- PostgreSQL database
- Row Level Security (RLS)
- Real-time subscriptions
- Automated functions
- Scheduled jobs

---

## Point Economics

### Point Categories

#### 1. Social Connections (One-Time Rewards)
Points earned by connecting verified social media accounts:

| Platform  | Points | Requirements |
|-----------|--------|--------------|
| Twitter   | 500    | Connect & verify Twitter account |
| Discord   | 300    | Connect & verify Discord account |
| Telegram  | 200    | Connect & verify Telegram account |
| GitHub    | 400    | Connect & verify GitHub account |

**Maximum from Social**: 1,400 points

#### 2. Referral Program
Earn points by inviting friends to join AAIC:

| Milestone | Points | Condition |
|-----------|--------|-----------|
| Base Referral | 200 | Friend signs up with your code |
| 1K Milestone | 500 | Friend reaches 1,000 points |
| 5K Milestone | 1,000 | Friend reaches 5,000 points |

**Example**: If you refer 10 friends and 5 reach 1,000 points, and 2 reach 5,000 points:
- Base: 10 × 200 = 2,000
- 1K Milestone: 5 × 500 = 2,500
- 5K Milestone: 2 × 1,000 = 2,000
- **Total**: 6,500 points

**No Limit on Referrals**

#### 3. Content Submissions
Create and submit content promoting AAIC:

| Content Type | Points | Requirements |
|--------------|--------|--------------|
| Article | 1,000 | Medium/blog post about AAIC (500+ words) |
| Video | 800 | YouTube/TikTok video about AAIC (2+ min) |
| Thread | 500 | Twitter/X thread about AAIC (5+ tweets) |
| Meme | 300 | High-quality meme about AAIC |

**Requirements**:
- Original content only
- Must mention AAIC
- Must be public and shareable
- Subject to admin review
- Spam/low-effort content rejected
- Maximum 1 submission per type per day

**Bonus**: Admins can award bonus points (50-200%) for exceptional content

#### 4. Daily Engagement (Recurring Rewards)
Earn points for consistent participation:

| Activity | Points | Details |
|----------|--------|---------|
| Daily Login | 10 | Login once per day |
| Weekly Streak | 100 | Login 7 consecutive days |
| Monthly Streak | 500 | Login 30 consecutive days |

**Example**: Active for 90 days with perfect attendance:
- Daily: 90 × 10 = 900
- Weekly: 12 × 100 = 1,200
- Monthly: 3 × 500 = 1,500
- **Total**: 3,600 points

#### 5. Manual Adjustments
Admins can award or deduct points:

| Reason | Points | Examples |
|--------|--------|----------|
| Exceptional Contribution | +500 to +2,000 | Major community help, outstanding content |
| Bug Report | +100 to +500 | Reporting security issues, critical bugs |
| Penalty | -100 to -5,000 | Rule violations, spam, attempted cheating |

All adjustments are logged and transparent to the user.

---

### Point Calculation Examples

#### **Example 1: Casual User**
- Connects Twitter (500) and Discord (300)
- Submits 2 memes (2 × 300)
- Refers 1 friend (200)
- Logs in 30 days (30 × 10)
- **Total**: 2,200 points

#### **Example 2: Active Contributor**
- Connects all 4 socials (1,400)
- Writes 3 articles (3 × 1,000)
- Creates 2 videos (2 × 800)
- Refers 5 friends, 2 hit 1K milestone (5 × 200 + 2 × 500)
- Logs in 60 days with streaks (60 × 10 + 8 × 100)
- **Total**: 9,900 points

#### **Example 3: Power User**
- Connects all 4 socials (1,400)
- Submits 10 approved articles (10 × 1,000)
- Submits 5 approved videos (5 × 800)
- Refers 20 friends, 15 hit 1K, 8 hit 5K (20 × 200 + 15 × 500 + 8 × 1,000)
- Logs in 90 days perfect (90 × 10 + 12 × 100 + 3 × 500)
- Receives bonus for exceptional content (+1,000)
- **Total**: 32,400 points

---

### Airdrop Allocation Formula

**Total Airdrop Pool**: [TBD] AAIC tokens

**Your Allocation** = (Your Points / Total Points) × Total Airdrop Pool

**Example**:
- Total Pool: 100,000,000 AAIC
- Total Points Earned by Community: 50,000,000
- Your Points: 10,000
- Your Allocation: (10,000 / 50,000,000) × 100,000,000 = **20,000 AAIC tokens**

**Note**: The more you contribute, the higher your percentage of the pool!

---

## User Flows

### 1. Signup & Onboarding

```
1. User visits website → Clicks "Join Airdrop"
2. Signs up with email or wallet
3. Receives unique referral code
4. Redirected to dashboard
5. Sees airdrop overview widget
6. Clicks "Connect Social Media"
7. Connects Twitter → +500 points
8. Dashboard updates with new points
9. Views leaderboard position
```

### 2. Earning Through Referrals

```
1. User copies referral link
2. Shares on social media
3. Friend clicks link
4. Friend signs up
5. User receives +200 points notification
6. Friend earns points through activities
7. Friend reaches 1,000 points
8. User receives +500 milestone bonus
9. Notification: "Your referral hit 1K milestone!"
```

### 3. Content Submission

```
1. User creates article about AAIC
2. Navigates to "Submit Content" tab
3. Fills form:
   - Content Type: Article
   - Title: "Why AAIC is Revolutionary"
   - URL: https://medium.com/@user/article
   - Description: Brief summary
   - Screenshot: [optional]
4. Submits for review
5. Status changes to "Pending Review"
6. Admin reviews within 24-48 hours
7. Admin approves → +1,000 points
8. User receives notification
9. Points reflected in dashboard
```

### 4. Daily Engagement

```
1. User visits dashboard daily
2. Automatic +10 points
3. After 7 consecutive days → +100 bonus
4. Notification: "7-day streak! Keep going!"
5. After 30 consecutive days → +500 bonus
6. Notification: "30-day streak! You're amazing!"
```

---

## Admin Operations

### Content Review Workflow

#### Queue Management
1. Admin logs into admin panel
2. Navigates to "Airdrop" → "Content Submissions"
3. Views pending submissions (sortable/filterable)
4. Clicks "Review" on submission

#### Individual Review
1. Modal opens with full details:
   - Content link (opens in new tab)
   - Screenshot preview
   - User's submission history
   - User's total points
2. Admin evaluates content:
   - Is it original?
   - Does it promote AAIC?
   - Is quality acceptable?
3. Admin adjusts points (optional)
4. Admin takes action:
   - **Approve**: Award points
   - **Reject**: No points, provide reason
   - **Request Changes**: Ask for improvements

#### Bulk Actions
- Select multiple submissions
- Bulk approve or reject
- Useful for obvious spam/quality content

---

### User Management

#### User Lookup
1. Admin searches by email, wallet, or social username
2. Views complete user profile:
   - Total points & rank
   - Points breakdown by category
   - Social connections
   - Referral stats
   - Submission history
   - Activity log

#### Manual Point Adjustment
1. Enter points amount (positive or negative)
2. Enter reason (required)
3. Confirm adjustment
4. User notified of change
5. Adjustment logged in audit trail

#### Flagging & Banning
- **Flag**: Mark user for review (no point loss)
- **Ban**: Prevent earning more points (keeps existing)
- All actions require reason
- Logged in audit trail

---

### Analytics Dashboard

#### Overview Metrics
- Total points distributed
- Total participants
- Average points per user
- Content submission stats
- Referral stats

#### Charts & Insights
- Points distribution histogram
- Daily new user growth
- Daily points earned
- Content type performance
- Referral conversion funnel

#### Time Range Selection
- Last 7 days
- Last 30 days
- Last 90 days
- All time

---

### Flagged Users Review

#### Auto-Flagged Users
System automatically flags suspicious activity:
- IP clustering (>5 accounts from same IP)
- Circular referrals
- Rapid point accumulation
- Duplicate social accounts
- Bot-like behavior

#### Review Process
1. Admin views flagged users list
2. Clicks "Review" to see user profile
3. Investigates activity:
   - Check IP history
   - Review referral patterns
   - Examine point timeline
4. Takes action:
   - **Clear Flag**: Legitimate user
   - **Ban**: Confirmed Sybil attacker

---

## Anti-Sybil Detection

### Detection Algorithms

#### 1. IP Clustering
```
Flag if:
- More than 5 accounts share same IP address
- Multiple accounts from same IP earn points quickly
- IP hopping detected (using VPN/proxies)

Risk Score: +50 (high) or +25 (medium)
```

#### 2. Social Graph Analysis
```
Flag if:
- Same Twitter account linked to multiple users
- Same Discord account linked to multiple users
- Pattern of reused social accounts

Risk Score: +35 per duplicate
```

#### 3. Behavioral Patterns
```
Flag if:
- Earn >500 points in first 24 hours
- Login >100 times in first week
- Earn >50 points per hour sustained
- Activity patterns too similar across accounts

Risk Score: +20 to +30
```

#### 4. Referral Chain Analysis
```
Flag if:
- Circular referrals detected (A→B→C→A)
- All referrals join within short time period
- Referrals have identical point patterns
- Referrals have similar scores (low variance)

Risk Score: +25 to +60
```

### Risk Thresholds

| Score Range | Classification | Action |
|-------------|----------------|--------|
| 0-29 | Safe | No action |
| 30-49 | Low Risk | Monitor |
| 50-79 | Medium Risk | Flag for review |
| 80+ | High Risk | Auto-flag, admin review required |

### Daily Sybil Scan

**Schedule**: Daily at 3:00 AM UTC

**Process**:
1. Scan top point holders (200 users)
2. Run detection algorithms
3. Calculate risk scores
4. Auto-flag high-risk accounts (80+)
5. Send admin notifications
6. Log scan results

**Important**: System never auto-bans. All bans require manual admin review.

---

## Technical Implementation

### Tech Stack

**Frontend**:
- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- React Router

**Backend**:
- Node.js
- Express.js
- TypeScript
- Supabase Client

**Database**:
- Supabase (PostgreSQL)
- Row Level Security
- Real-time subscriptions

**OAuth**:
- Twitter OAuth 2.0
- Discord OAuth 2.0
- Telegram Bot API
- GitHub OAuth 2.0

### Key Libraries

```json
{
  "@supabase/supabase-js": "^2.57.4",
  "express": "^4.18.2",
  "dompurify": "^3.3.1",
  "zod": "^3.22.4",
  "lucide-react": "^0.344.0"
}
```

---

## Database Schema

### Core Tables

#### `users`
```sql
- id (uuid, PK)
- email (text)
- wallet_address (text)
- role (text) -- 'user' | 'admin'
- created_at (timestamp)
```

#### `airdrop_leaderboard`
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- score (integer) -- total points
- rank (integer)
- referral_code (text, unique)
- referred_by_code (text)
- twitter_connected (boolean)
- discord_connected (boolean)
- telegram_connected (boolean)
- github_connected (boolean)
- total_logins (integer)
- flagged (boolean)
- banned (boolean)
- created_at (timestamp)
```

#### `point_transactions`
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- amount (integer) -- can be negative
- reason (text)
- reference_type (text)
- reference_id (uuid)
- created_by (uuid) -- for admin adjustments
- metadata (jsonb)
- created_at (timestamp)
```

#### `content_submissions`
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- content_type (text)
- title (text)
- url (text)
- description (text)
- screenshot_url (text)
- status (text) -- 'pending' | 'approved' | 'rejected'
- points_awarded (integer)
- reviewed_by (uuid, FK → users)
- reviewed_at (timestamp)
- review_notes (text)
- created_at (timestamp)
```

#### `daily_activities`
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- activity_type (text)
- activity_date (date)
- metadata (jsonb) -- includes IP, user agent, etc.
- created_at (timestamp)
```

### Row Level Security

All tables have RLS enabled:
- Users can read only their own data
- Users cannot modify points directly
- Admins have special policies for management
- Service role bypasses RLS where needed

---

## API Endpoints

### Client Endpoints

#### Get User Stats
```
GET /api/client/airdrop/stats
Auth: Required
Returns: { totalPoints, rank, totalUsers }
```

#### Connect Social Account
```
POST /api/client/airdrop/social/connect
Auth: Required
Body: { platform, accessToken }
Returns: { pointsAwarded, newTotal }
```

#### Submit Content
```
POST /api/client/airdrop/content/submit
Auth: Required
Body: { type, title, url, description, screenshot }
Returns: { submissionId, status }
```

#### Get Leaderboard
```
GET /api/client/airdrop/leaderboard?limit=100&offset=0
Auth: Optional
Returns: { users: [...], total }
```

#### Get Referral Stats
```
GET /api/client/airdrop/referrals
Auth: Required
Returns: { code, totalReferrals, qualifiedReferrals, points }
```

### Admin Endpoints

#### Get Pending Submissions
```
GET /api/admin/airdrop/submissions?status=pending
Auth: Admin
Returns: { submissions: [...] }
```

#### Review Submission
```
POST /api/admin/airdrop/submissions/:id/approve
Auth: Admin
Body: { points, reason }
Returns: { success, updatedPoints }
```

#### User Lookup
```
GET /api/admin/airdrop/users/search?q=email@example.com
Auth: Admin
Returns: { user profile data }
```

#### Adjust Points
```
POST /api/admin/airdrop/users/:userId/adjust-points
Auth: Admin
Body: { points, reason }
Returns: { success, newTotal }
```

#### Get Analytics
```
GET /api/admin/airdrop/analytics?range=30d
Auth: Admin
Returns: { overview, charts, metrics }
```

#### Get Flagged Users
```
GET /api/admin/airdrop/flagged-users
Auth: Admin
Returns: { users: [...] }
```

---

## Security

### Authentication
- JWT-based session tokens
- OAuth 2.0 for social connections
- Admin endpoints require admin role
- All endpoints validate authentication server-side

### Authorization
- Row Level Security on all tables
- RBAC for admin functions
- Users can only modify their own data
- Audit trail for all admin actions

### Input Validation
- All inputs validated server-side
- URLs validated before storing
- Content sanitized with DOMPurify
- SQL injection prevented via parameterized queries

### Rate Limiting
- 100 requests/15min per IP (global)
- 5 login attempts/15min per IP
- 5 content submissions/day per user
- Rate limit headers in responses

### Anti-Abuse
- IP tracking for fraud detection
- Daily Sybil scan
- Manual review for flagged accounts
- Content spam detection

### Data Protection
- HTTPS enforced
- Sensitive data encrypted
- OAuth tokens never exposed to client
- Personal data GDPR compliant

---

## Monitoring & Maintenance

### Daily Jobs
- Sybil detection scan (3 AM UTC)
- Data retention cleanup (30+ days)
- Leaderboard rank updates
- Streak calculation

### Logging
- All admin actions logged
- Point transactions logged
- Failed authentication attempts logged
- Suspicious activity logged

### Alerts
- High Sybil detection rate
- Database errors
- High rate limit violations
- Admin panel unusual activity

---

## Future Enhancements

### Phase 2 Features (Post-Launch)
- Quest system (complete challenges for bonus points)
- Team competitions
- Limited-time events
- NFT badges for top contributors
- Mobile app
- Additional social platforms
- Gamification elements

### Scaling Considerations
- Database optimization for 100K+ users
- CDN for static assets
- Caching layer (Redis)
- Read replicas for leaderboard
- Microservices architecture

---

## Support & Resources

**Documentation**: https://docs.aizuraconsortium.com
**Support Email**: support@aizuraconsortium.com
**Bug Reports**: GitHub Issues
**Community**: Discord Server

---

## Changelog

### Version 1.0 (Dec 2024)
- Initial release
- Social connections
- Referral program
- Content submissions
- Admin panel
- Anti-Sybil detection
- Leaderboard

---

**Last Updated**: December 25, 2024
**Version**: 1.0.0
**Status**: Production Ready
