# User Profile Enhancement - Implementation Plan

**Feature:** FEATURE 4: ENHANCED USER PROFILE
**Created:** December 25, 2024
**Status:** Planning Phase - Ready to Implement
**Estimated Duration:** 4-6 days
**Priority:** High

---

## Executive Summary

After auditing the existing codebase, **90% of the infrastructure already exists** through the airdrop system. This implementation will primarily focus on:
1. Adding basic profile fields to users table (display_name, bio, avatar_url)
2. Creating a profile page that **reuses existing airdrop components**
3. Extending SettingsView with profile editing

**Key Strategy:** Build on existing airdrop infrastructure rather than recreating it.

---

## What Already Exists ✅

### **Database Tables (Complete)**

#### `users` table
**Location:** `supabase/migrations/20251218135120_add_users_table.sql`

**Existing fields:**
- `id` (uuid, primary key)
- `auth_user_id` (uuid, unique) - Links to Supabase auth
- `role` (text) - 'admin' or 'client'
- `email` (text)
- `referral_code` (text, unique) ✅ Already exists!
- `referred_by` (text) - Who referred this user
- `wallet_address` (text, unique) ✅ Already exists!
- `last_login_date`, `login_streak`, `total_logins` ✅ Already exists!
- `created_at`, `updated_at`

#### `airdrop_leaderboard` table
**Location:** `supabase/migrations/20251224084454_add_community_engagement_system.sql`

**This table acts as a secondary user profile with extensive data:**
- `user_id`, `wallet_address`
- `score` (integer) - Total points ✅ Already exists!
- `referral_count` ✅ Already exists!
- **Social Connections** ✅ Already exists!:
  - `twitter_connected`, `twitter_user_id`, `twitter_username`, `twitter_verified_at`
  - `discord_connected`, `discord_user_id`, `discord_username`, `discord_verified_at`
  - `telegram_connected`, `telegram_user_id`, `telegram_username`, `telegram_verified_at`
  - `github_connected`, `github_user_id`, `github_username`, `github_verified_at`
- **Activity Metrics** ✅ Already exists!:
  - `total_logins`, `total_votes`, `total_comments`
  - `total_content_submitted`, `total_content_approved`
- `completed_tasks` (jsonb) - Array of task IDs
- `tier` (text) - Current tier (exists but not actively used)
- `last_activity` (timestamptz)

#### `point_transactions` table
**Complete activity history** ✅ Already exists!
- `user_id`, `amount`, `reason`, `reference_type`, `reference_id`
- `created_at`, `metadata` (jsonb)
- Tracks: social_connection, governance_vote, content_submission, referral, login_streak, etc.

#### `referral_rewards` table ✅ Already exists!
- `referrer_id`, `referee_id`, `milestone`, `points_awarded`

#### `content_submissions` table ✅ Already exists!
- User's content submission history

#### `daily_activities` table ✅ Already exists!
- Daily engagement tracking

#### `notification_preferences` table ✅ Already exists!
- User notification settings

### **API Endpoints (Comprehensive - Airdrop System)**

**Location:** `backend/client/controllers/airdropController.ts`

**All these endpoints already exist and work:**
- ✅ `GET /api/client/airdrop/my-stats` - Complete user stats (points, rank, breakdown, referrals, social)
- ✅ `GET /api/client/airdrop/points-breakdown` - Points categorized
- ✅ `GET /api/client/airdrop/point-history` - Activity history with pagination
- ✅ `GET /api/client/airdrop/referral-code` - Get/generate referral code
- ✅ `GET /api/client/airdrop/referrals` - List of referrals
- ✅ `GET /api/client/airdrop/referral-stats` - Referral statistics
- ✅ `GET /api/client/airdrop/social-connections` - All social connections
- ✅ `POST /api/client/airdrop/connect/{platform}` - Connect social accounts
- ✅ `DELETE /api/client/airdrop/disconnect/{platform}` - Disconnect social accounts
- ✅ `GET /api/client/airdrop/my-submissions` - Content submission history
- ✅ `POST /api/client/airdrop/track-activity` - Track engagement
- ✅ `PUT /api/client/airdrop/wallet-address` - Update wallet

### **Reusable Components (High Priority)**

#### **From `client/components/airdrop/`** ✅ All exist!

1. **`UserStatsHero.tsx`**
   - Displays total points, rank, estimated allocation
   - Progress bar to next milestone
   - Share rank button (Twitter integration)
   - **USE IN:** Profile overview section

2. **`PointsBreakdown.tsx`**
   - Categorizes points (social, content, referrals, governance)
   - Visual breakdown with icons
   - **USE IN:** Activity/achievements section

3. **`SocialConnections.tsx`**
   - Connect/disconnect Twitter, Discord, GitHub, Telegram
   - OAuth flow integration
   - Verification status and points earned
   - **USE IN:** Social connections section

4. **`ReferralCard.tsx`**
   - Referral code, URL, sharing buttons
   - Referral stats (total, qualified, pending)
   - List of referrals with progress bars
   - **USE IN:** Referral section

5. **`SubmissionHistory.tsx`**
   - Content submission history
   - **USE IN:** Contributions/history section

6. **`DailyTasks.tsx`**
   - Task completion checklist
   - **USE IN:** Activity/goals section

7. **`AirdropEstimate.tsx`**
   - Token allocation estimate
   - **USE IN:** Rewards preview section

8. **`LeaderboardTable.tsx`**
   - Rankings display
   - **USE IN:** Show user's rank and nearby users

#### **From `client/components/notifications/`** ✅ Exists!

1. **`NotificationPreferences.tsx`**
   - Already used in SettingsView
   - **KEEP AS IS**

#### **From `shared/components/ui/`** ✅ Complete UI Kit!

- **Card.tsx** - Card, CardHeader, CardTitle
- **Button.tsx** - Reusable button
- **Input.tsx** - Form input
- **FormField.tsx** - Form field wrapper
- **Modal.tsx**, **ModalHeader.tsx**, **ModalFooter.tsx**
- **PasswordInput.tsx** - Password with visibility toggle
- **Pagination.tsx** - Pagination controls
- **FilterPanel.tsx** - Filter UI

#### **From `shared/components/governance/`**

- **`ProposalStatusBadge.tsx`** - Generic badge component (can be adapted for tier/achievement badges)

### **Services (Complete)** ✅

- `backend/client/services/airdropService.ts` - Points, leaderboard, activity
- `backend/client/services/socialAuthService.ts` - OAuth flows
- `backend/client/services/referralService.ts` - Referral logic
- `backend/client/services/pointsService.ts` - Points calculations
- `backend/client/services/contentService.ts` - Content submissions

### **Hooks (Auth Available)** ✅

- `shared/hooks/useAuthBase.ts` - Base auth state
- `shared/hooks/useSupabaseAuth.ts` - Supabase auth
- `client/contexts/AuthContext.tsx` - User, session, auth methods

---

## What Needs to be Created ❌

### **1. Database Fields (5 minutes)**

**Add to `users` table:**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
```

**NOTE:** Social connections (twitter, discord, etc.) already exist in `airdrop_leaderboard` table!
**NOTE:** referral_code already exists in `users` table!
**NOTE:** wallet_address already exists in `users` table!
**NOTE:** Points/tier data exists in `airdrop_leaderboard` table!

**We DO NOT need:**
- ❌ twitter_handle (already in airdrop_leaderboard as twitter_username)
- ❌ discord_username (already in airdrop_leaderboard)
- ❌ telegram_username (already in airdrop_leaderboard)
- ❌ github_username (already in airdrop_leaderboard)
- ❌ referral_code (already in users table)
- ❌ total_points (already in airdrop_leaderboard as score)
- ❌ current_tier (already in airdrop_leaderboard as tier)
- ❌ user_badges table (we can use tier + achievements calculated from existing data)

### **2. Profile API Endpoints (2-3 hours)**

**Create:** `backend/client/controllers/profileController.ts`

```typescript
// GET /api/client/profile
// Aggregates data from users + airdrop_leaderboard
async getProfile(req, res) {
  const userId = req.user.id;

  // Get user data
  const user = await usersRepository.getById(userId);

  // Get airdrop stats (points, social, tier, etc.)
  const airdropStats = await airdropService.getMyStats(userId);

  // Combine and return
  return {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    bio: user.bio,
    avatar_url: user.avatar_url,
    wallet_address: user.wallet_address,
    referral_code: user.referral_code,

    // From airdrop system
    total_points: airdropStats.total_points,
    rank: airdropStats.rank,
    tier: airdropStats.tier,
    social_connections: airdropStats.social_connections,
    activity: airdropStats.engagement,
  };
}

// PUT /api/client/profile
// Update display_name, bio, avatar_url only
async updateProfile(req, res) {
  const userId = req.user.id;
  const { display_name, bio, avatar_url } = req.body;

  // Validate
  // Update users table
  // Return updated profile
}
```

**Create:** `backend/client/routes/profileRoutes.ts`

**Create:** `backend/client/services/profileService.ts` (thin wrapper)

### **3. Shared Components (4-6 hours)**

#### **A. `shared/components/ui/Avatar.tsx`** (NEW)

```typescript
interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string; // Initials
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  badge?: React.ReactNode; // Tier badge overlay
  onClick?: () => void;
  className?: string;
}
```

**Features:**
- Display image or fallback to colored circle with initials
- Sizes: xs(24px), sm(32px), md(40px), lg(64px), xl(128px)
- Badge overlay in bottom-right corner
- Hover effects
- Accessible (alt text, keyboard)

**Why Shared:** Generic component, reusable in website/admin

#### **B. `shared/components/ui/Badge.tsx`** (NEW)

```typescript
interface BadgeProps {
  variant: 'tier' | 'achievement' | 'status' | 'label';
  tier?: 1 | 2 | 3;
  label?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Features:**
- Tier badges: Gold (Tier 1), Silver (Tier 2), Bronze (Tier 3)
- Achievement badges: Icon + name
- Status badges: Online, offline, etc.
- Label badges: Generic colored labels
- Tooltip on hover
- Icons from lucide-react

**Why Shared:** Generic badge system, reusable across apps

#### **C. `shared/components/ui/Timeline.tsx`** (NEW)

```typescript
interface TimelineProps {
  items: TimelineItem[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

interface TimelineItem {
  id: string;
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp: string;
  metadata?: React.ReactNode;
}
```

**Features:**
- Vertical timeline with connecting line
- Icons in circles with colors
- Timestamp formatting (relative: "2 hours ago")
- Group by date ("Today", "Yesterday", "Dec 24")
- Load more button at bottom
- Skeleton loading states

**Why Shared:** Generic timeline, reusable for any chronological data

### **4. Client Components (6-8 hours)**

#### **A. `client/components/profile/ProfileHeader.tsx`** (NEW)

**Features:**
- Large Avatar (xl size) with edit button overlay (own profile)
- Display name (h1)
- Tier badge next to name (uses Badge component)
- Bio paragraph
- Location, website, joined date in row (optional - can defer)
- Social link icons (clickable) - pulls from airdrop_leaderboard
- Wallet address (truncated with copy button)
- Edit Profile button (own profile only)

**Why Client:** Uses client-specific auth and profile data

#### **B. `client/components/profile/EditProfileModal.tsx`** (NEW)

**Features:**
- Modal with form (uses shared Modal component)
- Fields: display_name, bio
- Avatar URL input (image upload can be Phase 2)
- Cancel and Save buttons
- Validation and error display
- Loading states

**Why Client:** Client-specific profile editing

#### **C. `client/components/profile/ActivityTimeline.tsx`** (NEW)

**Features:**
- Uses shared Timeline component
- Fetches data from existing `/api/client/airdrop/point-history` API
- Activity type icons and colors:
  - Login: User icon, blue
  - Vote: CheckCircle, green
  - Social: Twitter/Discord icon, platform color
  - Referral: Users icon, purple
  - Content: FileText, yellow
  - Points: Award, gold
- Activity descriptions: "Voted on proposal X", "Connected Twitter account"
- Points badge when applicable
- Filter buttons: All, Social, Governance, Referrals
- Pagination with infinite scroll

**Why Client:** Client-specific activity data

#### **D. `client/components/profile/BadgeCollection.tsx`** (NEW)

**Features:**
- Grid layout (3-4 columns)
- Achievement cards using Badge component:
  - Tier badge (from airdrop_leaderboard.tier)
  - Early Adopter (if user.created_at < launch date)
  - Social Butterfly (if all 4 socials connected)
  - Top Voter (if total_votes > 50)
  - Content Creator (if total_content_approved > 10)
- Unlocked/Locked state
- Hover tooltip with details
- Empty state: "No achievements yet"

**Achievements calculated from existing data:**
```typescript
const achievements = [
  {
    id: 'tier',
    type: 'tier',
    title: tierBadgeTitle(user.tier), // 'Gold', 'Silver', 'Bronze'
    unlocked: true,
    icon: Crown/Star/Shield
  },
  {
    id: 'early_adopter',
    type: 'achievement',
    title: 'Early Adopter',
    unlocked: user.created_at < LAUNCH_DATE,
    icon: Zap
  },
  {
    id: 'social_butterfly',
    type: 'achievement',
    title: 'Social Butterfly',
    unlocked: allSocialsConnected,
    icon: Users
  },
  {
    id: 'top_voter',
    type: 'achievement',
    title: 'Top Voter',
    unlocked: user.total_votes >= 50,
    icon: CheckCircle,
    progress: user.total_votes / 50 * 100
  }
];
```

**Why Client:** Client-specific achievements and tier display

### **5. Profile Page (3-4 hours)**

#### **`client/pages/ProfileView.tsx`** (NEW)

**Route:** `/dashboard/profile`

**Structure:**
```typescript
<DashboardLayout>
  <div className="profile-page">
    {/* Header */}
    <ProfileHeader user={profile} onEdit={() => setShowEditModal(true)} />

    {/* Tabbed Interface */}
    <Tabs>
      {/* Overview Tab */}
      <TabPanel>
        <UserStatsHero /> {/* REUSE from airdrop */}
        <PointsBreakdown /> {/* REUSE from airdrop */}
        <BadgeCollection achievements={achievements} />
      </TabPanel>

      {/* Activity Tab */}
      <TabPanel>
        <ActivityTimeline />
      </TabPanel>

      {/* Social Tab */}
      <TabPanel>
        <SocialConnections /> {/* REUSE from airdrop */}
      </TabPanel>

      {/* Referrals Tab */}
      <TabPanel>
        <ReferralCard /> {/* REUSE from airdrop */}
      </TabPanel>
    </Tabs>

    {/* Edit Modal */}
    {showEditModal && <EditProfileModal onClose={...} />}
  </div>
</DashboardLayout>
```

**Data Fetching:**
```typescript
// Fetch profile (new endpoint)
const { data: profile } = await api.get('/api/client/profile');

// Achievements calculated client-side from profile data
const achievements = calculateAchievements(profile);
```

**Why Client:** Client-specific page

### **6. Extend SettingsView (2-3 hours)**

**File:** `client/pages/SettingsView.tsx` (EDIT)

**Current Structure:**
- Wallet & Security section
- NotificationPreferences component
- Preferences section (language, theme)
- Security warnings

**Add:**

1. **Profile Settings Section** (at top)
   ```tsx
   <section>
     <h2>Profile Settings</h2>
     <FormField label="Display Name">
       <Input value={displayName} onChange={...} />
     </FormField>
     <FormField label="Bio">
       <textarea value={bio} onChange={...} />
     </FormField>
     <FormField label="Avatar URL">
       <Input value={avatarUrl} onChange={...} />
     </FormField>
   </section>
   ```

2. **Wire Save Button:**
   ```typescript
   const handleSave = async () => {
     await api.put('/api/client/profile', {
       display_name: displayName,
       bio: bio,
       avatar_url: avatarUrl
     });
     toast.success('Profile updated!');
   };
   ```

**Why Edit:** Extending existing Settings page

### **7. Hooks (2-3 hours)**

#### **`shared/hooks/useUserProfile.ts`** (NEW)

```typescript
export function useUserProfile(apiClient: ApiClient) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/client/profile');
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
}
```

**Why Shared:** Generic profile fetching, could be used in admin/website

#### **`shared/hooks/useProfileUpdate.ts`** (NEW)

```typescript
export function useProfileUpdate(apiClient: ApiClient) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true);
      await apiClient.put('/api/client/profile', data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}
```

**Why Shared:** Generic profile update hook

### **8. Types (30 minutes)**

**Add to `shared/types/models.ts` or create `shared/types/profile.ts`:**

```typescript
export interface UserProfile {
  // Basic info
  id: string;
  email: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
  referral_code: string;
  created_at: string;

  // From airdrop_leaderboard
  total_points: number;
  rank: number | null;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | null;
  referral_count: number;

  // Social connections
  social_connections: {
    twitter: SocialConnection | null;
    discord: SocialConnection | null;
    github: SocialConnection | null;
    telegram: SocialConnection | null;
  };

  // Activity metrics
  activity: {
    total_logins: number;
    login_streak: number;
    total_votes: number;
    total_comments: number;
    total_content_submitted: number;
    total_content_approved: number;
    last_activity: string;
  };
}

export interface SocialConnection {
  connected: boolean;
  username: string | null;
  verified: boolean;
  verified_at: string | null;
}

export interface Achievement {
  id: string;
  type: 'tier' | 'achievement';
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
  progress?: number; // 0-100
}
```

---

## Component Organization: Shared vs Client

### **✅ SHARED Components** (`shared/components/`)

**Criteria:** Generic, reusable across website/admin/client, no app-specific logic

**New Components:**
1. `ui/Avatar.tsx` - Generic avatar display
2. `ui/Badge.tsx` - Generic badge (tier, achievement, status)
3. `ui/Timeline.tsx` - Generic timeline display

**New Hooks:**
1. `useUserProfile.ts` - Generic profile fetching
2. `useProfileUpdate.ts` - Generic profile update

**New Types:**
1. `profile.ts` or add to `models.ts` - UserProfile, Achievement types

### **✅ CLIENT Components** (`client/components/profile/`)

**Criteria:** Uses client-specific APIs, business logic, composes shared components

**New Components:**
1. `ProfileHeader.tsx` - Client profile header
2. `EditProfileModal.tsx` - Client profile editing
3. `ActivityTimeline.tsx` - Client activity display (uses shared Timeline)
4. `BadgeCollection.tsx` - Client achievements (uses shared Badge)

**New Page:**
1. `pages/ProfileView.tsx` - Main profile page

**Edited Page:**
1. `pages/SettingsView.tsx` - Add profile editing section

---

## Implementation Phases

### **Phase 1: Database + Backend API (Day 1 - 4 hours)**

**Tasks:**
1. Create migration `supabase/migrations/YYYYMMDDHHMMSS_extend_users_for_profile.sql`
   - Add display_name, bio, avatar_url to users table
   - Add RLS policies

2. Create `backend/client/controllers/profileController.ts`
   - GET /profile - Aggregate users + airdrop_leaderboard
   - PUT /profile - Update name, bio, avatar

3. Create `backend/client/services/profileService.ts`
   - getUserProfile() - Combine data from multiple sources
   - updateProfile() - Validation and update

4. Create `backend/client/routes/profileRoutes.ts`
   - Wire up routes

5. Register routes in `backend/index.ts`

**Files:**
- `supabase/migrations/YYYYMMDDHHMMSS_extend_users_for_profile.sql` (NEW)
- `backend/client/controllers/profileController.ts` (NEW)
- `backend/client/services/profileService.ts` (NEW)
- `backend/client/routes/profileRoutes.ts` (NEW)
- `backend/index.ts` (EDIT - register routes)

**Success Criteria:**
- ✅ Can GET /api/client/profile and receive aggregated data
- ✅ Can PUT /api/client/profile and update fields
- ✅ RLS policies enforce user can only update own profile

---

### **Phase 2: Shared Components (Day 2 - 4-6 hours)**

**Tasks:**
1. Create `shared/components/ui/Avatar.tsx`
   - All sizes
   - Image or initials fallback
   - Badge overlay support
   - Accessible

2. Create `shared/components/ui/Badge.tsx`
   - Tier variants (Gold, Silver, Bronze)
   - Achievement variant
   - Status variant
   - Tooltips

3. Create `shared/components/ui/Timeline.tsx`
   - Vertical timeline
   - Icons and colors
   - Date grouping
   - Load more
   - Loading states

4. Create `shared/hooks/useUserProfile.ts`
   - Fetch profile data
   - Loading/error states
   - Refetch function

5. Create `shared/hooks/useProfileUpdate.ts`
   - Update profile mutation
   - Loading/error states

6. Add types to `shared/types/profile.ts`
   - UserProfile interface
   - Achievement interface

**Files:**
- `shared/components/ui/Avatar.tsx` (NEW)
- `shared/components/ui/Badge.tsx` (NEW)
- `shared/components/ui/Timeline.tsx` (NEW)
- `shared/hooks/useUserProfile.ts` (NEW)
- `shared/hooks/useProfileUpdate.ts` (NEW)
- `shared/types/profile.ts` (NEW)

**Success Criteria:**
- ✅ Avatar displays image or initials correctly
- ✅ Badge displays tier colors correctly
- ✅ Timeline displays items with proper formatting
- ✅ Hooks fetch and update profile data

---

### **Phase 3: Client Components (Day 3 - 6-8 hours)**

**Tasks:**
1. Create `client/components/profile/ProfileHeader.tsx`
   - Uses Avatar component
   - Uses Badge for tier
   - Displays all profile info
   - Edit button

2. Create `client/components/profile/EditProfileModal.tsx`
   - Uses shared Modal
   - Form with validation
   - Uses useProfileUpdate hook
   - Success/error feedback

3. Create `client/components/profile/ActivityTimeline.tsx`
   - Uses shared Timeline component
   - Fetches from point-history API
   - Activity type icons/colors
   - Filter buttons
   - Pagination

4. Create `client/components/profile/BadgeCollection.tsx`
   - Uses shared Badge component
   - Calculate achievements from profile data
   - Grid layout
   - Tooltip descriptions
   - Progress bars for in-progress

**Files:**
- `client/components/profile/ProfileHeader.tsx` (NEW)
- `client/components/profile/EditProfileModal.tsx` (NEW)
- `client/components/profile/ActivityTimeline.tsx` (NEW)
- `client/components/profile/BadgeCollection.tsx` (NEW)

**Success Criteria:**
- ✅ ProfileHeader displays all user info correctly
- ✅ EditProfileModal can update profile
- ✅ ActivityTimeline shows user's point history
- ✅ BadgeCollection shows earned achievements

---

### **Phase 4: Profile Page (Day 4 - 3-4 hours)**

**Tasks:**
1. Create `client/pages/ProfileView.tsx`
   - Uses ProfileHeader
   - Tabbed interface (Overview, Activity, Social, Referrals)
   - Reuses existing airdrop components:
     - UserStatsHero
     - PointsBreakdown
     - SocialConnections
     - ReferralCard
   - Uses new components:
     - ActivityTimeline
     - BadgeCollection
   - Edit modal

2. Add route in `client/App.tsx`
   - Route: /dashboard/profile
   - Protected route

3. Add navigation link in `client/components/layout/Sidebar.tsx`
   - "Profile" link

4. Add profile link in `client/components/layout/TopBar.tsx`
   - User dropdown with "View Profile"

**Files:**
- `client/pages/ProfileView.tsx` (NEW)
- `client/App.tsx` (EDIT - add route)
- `client/components/layout/Sidebar.tsx` (EDIT - add nav link)
- `client/components/layout/TopBar.tsx` (EDIT - add dropdown link)

**Success Criteria:**
- ✅ Can navigate to /dashboard/profile
- ✅ Profile page displays all tabs correctly
- ✅ Reused airdrop components work as expected
- ✅ Can open edit modal and update profile
- ✅ Navigation links work

---

### **Phase 5: Extend SettingsView (Day 5 - 2-3 hours)**

**Tasks:**
1. Edit `client/pages/SettingsView.tsx`
   - Add Profile Settings section at top
   - Fields: display_name, bio, avatar_url
   - Wire Save Changes button to profile API
   - Success/error toasts
   - Loading states

**Files:**
- `client/pages/SettingsView.tsx` (EDIT)

**Success Criteria:**
- ✅ Profile settings section appears in Settings
- ✅ Can edit and save profile fields
- ✅ Shows success toast on save
- ✅ Shows error toast on failure
- ✅ Loading state during save

---

### **Phase 6: Polish & Testing (Day 6 - Optional)**

**Tasks:**
1. Mobile responsive design
2. Accessibility (keyboard nav, ARIA labels)
3. Loading skeletons
4. Error handling
5. Empty states
6. Animations/transitions

**Success Criteria:**
- ✅ Works on mobile devices
- ✅ Keyboard navigation works
- ✅ Screen reader friendly
- ✅ Smooth loading states
- ✅ Graceful error handling

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PROFILE VIEW                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Overview │  │ Activity │  │  Social  │  │Referrals│ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
                      │
                      │ useUserProfile()
                      ▼
┌─────────────────────────────────────────────────────────┐
│             PROFILE CONTROLLER                           │
│  GET /profile → aggregates users + airdrop_leaderboard  │
│  PUT /profile → updates users table                     │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   DATABASE                               │
│  ┌────────────┐         ┌──────────────────────────┐   │
│  │   users    │         │  airdrop_leaderboard     │   │
│  │ NEW:       │         │  EXISTING:               │   │
│  │ -name      │◄────────┤  -score (points)         │   │
│  │ -bio       │         │  -tier                   │   │
│  │ -avatar    │         │  -social connections     │   │
│  │            │         │  -activity metrics       │   │
│  │ EXISTING:  │         │  -referral_count         │   │
│  │ -wallet    │         │                          │   │
│  │ -referral  │         │                          │   │
│  │  code      │         │                          │   │
│  └────────────┘         └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Tier System (Already Exists in DB!)

**Current State:** `airdrop_leaderboard.tier` field exists but not actively used

**Tier Calculation:**
Based on total points in `airdrop_leaderboard.score`:

| Tier | Points Range | Badge Color | Icon |
|------|--------------|-------------|------|
| Tier 1 (Gold) | 1000+ | Gold/Yellow | Crown |
| Tier 2 (Silver) | 500-999 | Silver/Gray | Star |
| Tier 3 (Bronze) | 0-499 | Bronze/Brown | Shield |

**Implementation:**
- Calculate tier based on score when fetching profile
- Display tier badge on profile header
- Show tier in BadgeCollection

---

## Achievement System (Calculate from Existing Data)

**No new tables needed!** Calculate achievements from existing data:

```typescript
const achievements = [
  {
    id: 'tier',
    title: getTierName(user.tier),
    unlocked: true,
    icon: getTierIcon(user.tier)
  },
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    unlocked: user.created_at < LAUNCH_DATE,
    icon: 'Zap'
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    unlocked: allSocialsConnected(user.social_connections),
    icon: 'Users'
  },
  {
    id: 'top_voter',
    title: 'Top Voter',
    unlocked: user.activity.total_votes >= 50,
    progress: Math.min(100, (user.activity.total_votes / 50) * 100),
    icon: 'CheckCircle'
  },
  {
    id: 'content_creator',
    title: 'Content Creator',
    unlocked: user.activity.total_content_approved >= 10,
    progress: Math.min(100, (user.activity.total_content_approved / 10) * 100),
    icon: 'FileText'
  },
  {
    id: 'referral_champion',
    title: 'Referral Champion',
    unlocked: user.referral_count >= 10,
    progress: Math.min(100, (user.referral_count / 10) * 100),
    icon: 'UserPlus'
  }
];
```

---

## File Structure

```
/tmp/cc-agent/61496421/project/
│
├── supabase/migrations/
│   └── YYYYMMDDHHMMSS_extend_users_for_profile.sql (NEW)
│
├── backend/client/
│   ├── controllers/
│   │   └── profileController.ts (NEW)
│   ├── services/
│   │   └── profileService.ts (NEW)
│   └── routes/
│       └── profileRoutes.ts (NEW)
│
├── shared/
│   ├── components/ui/
│   │   ├── Avatar.tsx (NEW)
│   │   ├── Badge.tsx (NEW)
│   │   └── Timeline.tsx (NEW)
│   ├── hooks/
│   │   ├── useUserProfile.ts (NEW)
│   │   └── useProfileUpdate.ts (NEW)
│   └── types/
│       └── profile.ts (NEW)
│
└── client/
    ├── components/profile/
    │   ├── ProfileHeader.tsx (NEW)
    │   ├── EditProfileModal.tsx (NEW)
    │   ├── ActivityTimeline.tsx (NEW)
    │   └── BadgeCollection.tsx (NEW)
    ├── pages/
    │   ├── ProfileView.tsx (NEW)
    │   └── SettingsView.tsx (EDIT)
    ├── components/layout/
    │   ├── Sidebar.tsx (EDIT - add nav link)
    │   └── TopBar.tsx (EDIT - add dropdown)
    └── App.tsx (EDIT - add route)
```

---

## Summary of Work

### **REUSE (No Work Needed)** ✅

- ✅ Social connections (Twitter, Discord, GitHub, Telegram) - Already in airdrop_leaderboard
- ✅ Points system - Already in airdrop_leaderboard.score
- ✅ Referral code - Already in users.referral_code
- ✅ Wallet address - Already in users.wallet_address
- ✅ Activity tracking - Already in point_transactions
- ✅ 8+ components from airdrop (UserStatsHero, PointsBreakdown, SocialConnections, etc.)
- ✅ Complete API endpoints for stats, social, referrals, activity
- ✅ Complete UI component library (Card, Button, Input, Modal, etc.)

### **CREATE (New Work)** ❌

**Database (5 min):**
- Add 3 fields to users table: display_name, bio, avatar_url

**Backend (4 hours):**
- ProfileController (2 endpoints)
- ProfileService (thin wrapper)
- ProfileRoutes

**Shared (4-6 hours):**
- Avatar component
- Badge component
- Timeline component
- useUserProfile hook
- useProfileUpdate hook
- Profile types

**Client (11-15 hours):**
- ProfileHeader component
- EditProfileModal component
- ActivityTimeline component
- BadgeCollection component
- ProfileView page (NEW)
- SettingsView (EDIT)
- Navigation updates

**Total: ~20-25 hours (4-5 days)**

---

## Success Criteria

### **Phase 1-2 Complete (Backend + Shared)**
- ✅ Profile API endpoints functional
- ✅ Avatar, Badge, Timeline components working
- ✅ Hooks fetch and update profile data

### **Phase 3-4 Complete (Client Components + Page)**
- ✅ Profile page displays all user data
- ✅ Can edit profile via modal
- ✅ Activity timeline shows point history
- ✅ Badges/achievements display correctly
- ✅ Reused airdrop components work

### **Phase 5 Complete (Settings Integration)**
- ✅ Settings page has profile editing
- ✅ Can save changes successfully

### **Overall Complete**
- ✅ Users can view comprehensive profile
- ✅ Users can edit display name, bio, avatar
- ✅ Social connections visible (from airdrop data)
- ✅ Activity history visible (from point transactions)
- ✅ Achievements/badges visible (calculated)
- ✅ Tier system visible (from airdrop data)
- ✅ Mobile responsive
- ✅ Accessible

---

## Timeline Estimate

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1 | 4 hours | Database + Backend API |
| Phase 2 | 4-6 hours | Shared Components + Hooks |
| Phase 3 | 6-8 hours | Client Components |
| Phase 4 | 3-4 hours | Profile Page |
| Phase 5 | 2-3 hours | Settings Extension |
| Phase 6 | 4+ hours | Polish (optional) |

**Total: 19-25 hours (4-5 days)**

---

## Next Steps

1. **Review this plan** - Confirm scope and approach
2. **Begin Phase 1** - Database migration and backend API
3. **Iterate through phases** - Build incrementally
4. **Test as you go** - Verify each phase works before moving on

---

**Ready to start Phase 1: Database + Backend API?**
