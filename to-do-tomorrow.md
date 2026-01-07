# TO-DO TOMORROW: Smart Contract & Real Data Integration

## CRITICAL: Smart Contract Implementations

### 1. Airdrop Smart Contract (HIGHEST PRIORITY)
**File:** `blockchain/contracts/Airdrop.sol` (create if doesn't exist)
**Status:** MUST BE SMART CONTRACT (not database)

**Requirements:**
- [ ] Deploy airdrop contract with merkle tree for eligibility
- [ ] Implement tier system (Tier 1, 2, 3 allocations)
- [ ] Add referral bonus logic (+5% per referral, +50% at 10 referrals)
- [ ] Implement 2% lifetime staking rewards from referrals
- [ ] Create claim function with proper validation
- [ ] Deploy to testnet first, audit, then mainnet

**Update These Files After Deploy:**
- `/website/pages/token/Airdrop.tsx` - Replace mock data with contract queries
  - Line 235: "5,284 participants" → Query from smart contract
  - Line 243: "127 Tier 1 spots" → Calculate from contract eligibility
  - Line 778: Airdrop distribution percentages → Verify match contract
- Create `blockchain/scripts/updateAirdropData.ts` to fetch real-time data from contract

---

### 2. Launchpad/Governance Smart Contract (DECISION NEEDED)
**Status:** NEED TO DECIDE - Smart Contract or Database?

**Option A: Smart Contract (Recommended for Transparency)**
- ✅ Full on-chain governance
- ✅ Trustless voting
- ✅ Immutable proposals
- ❌ Higher gas costs
- ✅ Better for legitimacy

**Option B: Database with Future Smart Contract Migration (V2)**
- ✅ Faster iteration during beta
- ✅ Lower costs initially
- ✅ Easier to modify
- ⚠️ Migrate to smart contracts in Q3 2025

**DECISION REQUIRED:** Which approach for initial launch?

**If Smart Contract (Option A):**
- [ ] Deploy Governance.sol contract
- [ ] Deploy ProposalFactory.sol contract
- [ ] Implement voting mechanism
- [ ] Add treasury integration
- [ ] Create proposal submission function (1,000 AAIC deposit requirement)

**If Database (Option B):**
- [ ] Mark all governance data as "Beta - Database Mode"
- [ ] Add prominent notice: "Full on-chain governance launches Q3 2025"
- [ ] Build database schema for proposals, votes, etc.
- [ ] Plan migration path to smart contracts

**Files to Update:**
- `/website/pages/launchpad/LaunchpadOverview.tsx` - Already updated with "Coming Q2 2025" notice
- Verify beta metrics (47 proposals in draft, 1,200+ beta testers, 8,500+ waitlist) are accurate

---

### 3. Real Data Integration Tasks

**Airdrop Page** (`/website/pages/token/Airdrop.tsx`):
- [ ] Connect to smart contract for live participant count
- [ ] Query remaining tier allocations in real-time
- [ ] Add "Live Data" badge when showing real numbers
- [ ] Add last updated timestamp
- [ ] Implement automatic refresh every 30 seconds

**Launchpad Page** (`/website/pages/launchpad/LaunchpadOverview.tsx`):
- [ ] ✅ Replaced with "Coming Q2 2025" notice (already done in PART 6)
- [ ] Verify beta metrics are tracked (proposals in draft, beta testers, waitlist)
- [ ] Set up waitlist signup tracking

**Portfolio Pages:**
- [ ] `/website/pages/portfolio/FoundationBusinesses.tsx`
  - Line 140: "$5M-$20M Revenue Target" → Already marked as target (done in PART 6)
  - Line 146: "2,400+ Users Validated Model" → Verify this is accurate from foundation business analytics
  - Line 152: "$50M+ Portfolio Value Potential" → Already marked as projection (done in PART 6)
  - Line 158: "99.8% Operational Uptime" → Connect to UptimeRobot API or remove if not tracking
  - Add data source citations to all metrics

**Home Page** (`/website/pages/Home.tsx`):
- [ ] ✅ Updated "Ecosystem Target Metrics" with pre-launch disclaimers (done in PART 6)
- [ ] Verify all metrics labeled as "Target" or "Projected"

---

### 4. Analytics & Monitoring Setup
- [ ] Set up Google Analytics or Plausible for real user metrics
- [ ] Integrate UptimeRobot for 99.8% uptime claims
- [ ] Create admin dashboard to view real revenue (if tracking internally)
- [ ] Set up blockchain explorer links for transparency
- [ ] Implement automated data refresh for contract-based metrics

---

### 5. Data Verification Checklist
Before going live, verify:
- [ ] All percentages have sources or disclaimers
- [ ] All revenue figures marked as "Projected" or backed by real data
- [ ] All "live" metrics actually update in real-time
- [ ] All smart contract addresses published and verified on explorer
- [ ] Methodology page linked from every major claim
- [ ] Legal disclaimer on every page with financial projections
- [ ] Pre-launch disclaimers clearly visible on all pages with future metrics

---

### 6. Smart Contract Deployment Checklist

**Pre-Deployment:**
- [ ] Code review by 2+ developers
- [ ] Security audit by external firm
- [ ] Testnet deployment and testing (minimum 2 weeks)
- [ ] Gas optimization review
- [ ] Emergency pause functionality implemented
- [ ] Multi-sig wallet setup for contract ownership

**Deployment Steps:**
1. [ ] Deploy to BNB Chain testnet
2. [ ] Run full test suite
3. [ ] Community beta testing period
4. [ ] Security audit results reviewed and fixes implemented
5. [ ] Deploy to BNB Chain mainnet
6. [ ] Verify contract on BscScan
7. [ ] Transfer ownership to multi-sig wallet
8. [ ] Announce contract addresses publicly

**Post-Deployment:**
- [ ] Update website with contract addresses
- [ ] Add blockchain explorer links
- [ ] Enable real-time data fetching
- [ ] Monitor for any issues
- [ ] Document all contract interactions

---

### 7. Database vs Smart Contract Decision Matrix

| Feature | Database | Smart Contract |
|---------|----------|----------------|
| **Airdrop System** | ❌ Not Recommended | ✅ **REQUIRED** |
| **Governance Voting** | ⚠️ Temporary OK | ✅ Recommended for Trust |
| **Proposal Storage** | ✅ OK for beta | ✅ Better long-term |
| **Treasury Management** | ❌ Never | ✅ **REQUIRED** |
| **Token Distribution** | ❌ Never | ✅ **REQUIRED** |
| **User Profiles** | ✅ Recommended | ❌ Expensive |
| **Activity Tracking** | ✅ Recommended | ❌ Too expensive |
| **Analytics** | ✅ Recommended | ❌ Impractical |

**Recommendation:**
- **MUST use smart contracts:** Airdrop, token distribution, treasury
- **Should use smart contracts:** Governance voting (can start with database)
- **Should use database:** User profiles, activity tracking, analytics

---

## NOTES:
- Airdrop MUST be smart contract (security + transparency)
- Launchpad can start as database, migrate later (decision needed)
- Better to show "Coming Soon" than fake numbers ✅ (Done in PART 6)
- Always mark projections clearly ✅ (Done in PART 6)
- Pre-launch disclaimers added to all major pages ✅ (Done in PART 6)

---

## COMPLETED IN PART 6:
- ✅ Replaced LaunchpadOverview with "Coming Q2 2025" notice
- ✅ Added pre-launch disclaimers to Home page
- ✅ Replaced "Real User Examples" with illustrative earning scenarios
- ✅ Added transparency notices about beta/projected metrics
- ✅ Updated all major metrics pages with pre-launch context

## NEXT PRIORITIES:
1. **Airdrop Smart Contract** - Highest priority, cannot launch without this
2. **Decide Governance Approach** - Smart contract vs database for initial launch
3. **Set Up Real Analytics** - Connect to actual data sources for uptime, users, etc.
4. **Deploy & Verify** - Get contracts on mainnet and verified on BscScan
