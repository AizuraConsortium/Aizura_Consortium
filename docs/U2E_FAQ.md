# Use-to-Earn (U2E) Frequently Asked Questions

## General Questions

### What is Use-to-Earn (U2E)?

Use-to-Earn (U2E) is a reward system that distributes AAIC tokens to users based on their actual usage of ecosystem products. Instead of earning tokens through speculation or holding, users earn rewards by actively using AI Traders, AI Business Factory, and AI Web Dev platforms.

### How is U2E different from other reward programs?

Unlike traditional staking or yield farming:
- **Action-Based**: Rewards tied to specific actions, not passive holding
- **Genuine Usage**: Incentivizes real value creation, not speculation
- **Sustainable**: Transitions from fixed supply to revenue-backed rewards
- **Fair**: Transparent rates published openly with no preferential treatment

### When does the U2E system go live?

The U2E system will be activated after the airdrop campaign concludes. Usage tracking before activation is for analytics purposes only. Rewards begin accruing only after the system is officially activated.

### Is U2E available to everyone?

Yes, U2E rewards are available to all ecosystem users who:
- Have a valid account
- Use platforms for legitimate purposes
- Pass fraud detection checks
- Comply with Terms of Service

---

## How It Works

### How do I participate in U2E?

Simply use any of the participating platforms:
1. **AI Traders** - Execute trades and deploy strategies
2. **AI Business Factory** - Create and launch businesses
3. **AI Web Dev** - Complete projects and deployments

Rewards accrue automatically based on your actions.

### What actions earn rewards?

Each platform has specific reward-earning actions:

**AI Traders:**
- Execute Trade: 5 AAIC
- Profitable Trade: 10 AAIC
- Strategy Deployment: 25 AAIC

**AI Business Factory:**
- Create Business: 50 AAIC
- Business Launch: 100 AAIC
- Revenue Milestone: 200 AAIC

**AI Web Dev:**
- Project Completion: 10 AAIC
- Deployment: 20 AAIC
- Client Milestone: 50 AAIC

*Note: Rates shown are current Phase 1 rates and may be adjusted by governance.*

### How are rewards calculated?

Rewards are calculated using a simple formula:

```
Total Rewards = Σ (Action Count × Reward Rate per Action)
```

For example:
- 10 trades × 5 AAIC = 50 AAIC
- 2 businesses created × 50 AAIC = 100 AAIC
- **Total**: 150 AAIC earned

### Is there a limit to how much I can earn?

There are no hard limits on earnings, but:
- Rate limiting prevents abuse (e.g., spam actions)
- Fraud detection flags suspicious patterns
- System administrators can suspend accounts for abuse
- Rewards must come from genuine, legitimate usage

### When can I claim my rewards?

Rewards accrue only after the U2E system is officially activated (post-airdrop). Once activated, you can claim rewards monthly based on your point accumulation. There are no retroactive rewards for usage before system activation.

---

## Tokenomics Questions

### What are the three phases of U2E?

**Phase 1: Fixed Token Supply (48 months)**
- Rewards come from pre-allocated 22M AAIC tokens
- Monthly pool of 458,333 AAIC distributed based on points
- Points-based formula: (User Points / Total Points) × Monthly Pool
- Predictable and transparent

**Phase 2: Hybrid Transition (Future)**
- Mix of fixed supply + revenue-backed rewards
- Gradual transition model
- Tests revenue sustainability

**Phase 3: 100% Revenue-Backed (Post-Phase 1)**
- All rewards funded by ecosystem business revenue (15% of net profit)
- Completely sustainable model
- Scales with ecosystem success

### Why transition to revenue-backed rewards?

Fixed token emissions eventually run out. Revenue-backed rewards create a sustainable model that:
- Can continue indefinitely
- Scales with ecosystem growth
- Aligns with business performance
- Maintains honest economics

### How does revenue-backed reward distribution work?

In Phase 3:
1. Ecosystem businesses generate revenue
2. A portion is allocated to U2E rewards
3. Revenue is used to buy AAIC from the market
4. Tokens are distributed to active users
5. Process repeats monthly/quarterly

This creates continuous demand for AAIC while rewarding genuine users.

### Will reward rates change over time?

Yes. Reward rates may be adjusted by:
- Governance votes
- System administrators (within bounds)
- Automatic adjustments based on usage patterns
- Phase transitions

All changes are transparent and announced in advance.

---

## Security & Privacy

### How is my usage tracked?

Usage tracking occurs through:
- API calls with authentication
- Idempotency keys to prevent duplicates
- Secure webhook integrations
- Server-side validation

All tracking is automated and secure.

### What about privacy?

We track:
- Action types (e.g., "trade executed")
- Timestamps
- User IDs
- Basic metadata

We do NOT track:
- Personal trading strategies
- Confidential business details
- Sensitive project information

### How do you prevent fraud and abuse?

Multiple layers of protection:
- **Idempotency Keys**: Prevent duplicate submissions
- **Rate Limiting**: Blocks spam and rapid-fire actions
- **Pattern Analysis**: Flags suspicious behavior
- **Manual Review**: Admins investigate flagged accounts
- **Account Suspension**: Abusers are banned

### What happens if I'm flagged for fraud?

If your account is flagged:
1. Suspicious actions are not rewarded
2. You may receive a warning
3. Repeated violations lead to suspension
4. Serious abuse results in permanent ban

Appeals can be submitted to support.

---

## Claiming & Using Rewards

### How do I check my U2E balance?

Visit your U2E Dashboard at `/client/u2e` to see:
- Total earned AAIC
- Current month earnings
- Usage history
- Business breakdown
- Claimable amount (when system is active)

### What can I do with earned AAIC?

Once claimed, use AAIC tokens for:
- **Governance Voting**: Vote on proposals
- **Proposal Submission**: Submit business ideas
- **Staking** (future): Earn revenue share
- **Trading**: Exchange on DEXs
- **Ecosystem Services**: Premium features

### Are there fees to claim rewards?

No claim fees from the platform. However:
- Gas fees apply for on-chain transactions
- Exchange fees apply if trading
- Network congestion may increase costs

### Can I transfer my U2E rewards to someone else?

Unclaimed rewards are non-transferable and tied to your account. Once claimed as AAIC tokens, they can be transferred like any other token.

---

## Platform-Specific Questions

### AI Traders: How are trades verified?

Trades are verified through:
- Direct API integration
- Trade confirmation receipts
- Exchange webhooks
- Automated settlement checks

### AI Business Factory: What counts as a "business launch"?

A business launch requires:
- Complete business profile
- Deployed infrastructure
- Active operations
- First customer/transaction

### AI Web Dev: How is project completion verified?

Projects are verified via:
- Deployment confirmations
- Client sign-off (for B2B)
- Automated testing results
- Domain/hosting checks

---

## Common Issues

### My rewards aren't showing up. Why?

Possible reasons:
- Action not yet processed (can take 1-5 minutes)
- Action failed fraud checks
- System maintenance
- Rate limit exceeded
- Invalid/duplicate action

Check your dashboard for pending actions and error logs.

### Can I appeal a rejected reward?

Yes. If you believe a reward was incorrectly rejected:
1. Gather supporting evidence
2. Submit appeal via support
3. Admin reviews within 48 hours
4. Decision is final

### What if I disagree with a rate change?

Participate in governance:
- Voice concerns in community forums
- Submit a counter-proposal
- Vote against changes you oppose
- Engage with decision-makers

Governance is community-driven and responsive to feedback.

---

## Technical Questions

### What blockchain is U2E built on?

U2E operates on:
- **Backend**: PostgreSQL with Supabase
- **Token**: Ethereum (ERC-20 AAIC)
- **Claims**: On-chain smart contracts
- **Tracking**: Off-chain for efficiency

### Is there an API for tracking U2E?

Yes. Developers can:
- Check balances via REST API
- Query usage history
- View reward rates
- Access analytics

See [U2E Integration Guide](./U2E_INTEGRATION_GUIDE.md) for details.

### How does the webhook system work?

External businesses integrate via:
1. Register for API key
2. Send usage events to webhook endpoint
3. Events validated and processed
4. Rewards calculated and credited

See [U2E Webhook API](./U2E_WEBHOOK_API.md) for technical details.

---

## Risks & Disclaimers

### What are the risks of participating in U2E?

Risks include:
- **Token Value Volatility**: AAIC price can fluctuate
- **Reward Rate Changes**: Rates may decrease
- **System Changes**: Program terms may evolve
- **Platform Risk**: Businesses may underperform
- **Regulatory Risk**: Future regulations may impact program

### Is U2E guaranteed income?

**No.** U2E rewards are:
- Not guaranteed
- Subject to change
- Dependent on usage
- Affected by market conditions

Only participate if you would use the platforms regardless of rewards.

### Can the U2E program be shut down?

Yes. The program may be:
- Suspended temporarily for maintenance
- Modified by governance vote
- Discontinued if unsustainable
- Replaced by alternative systems

All participants will be notified in advance of major changes.

### Is this financial advice?

**No.** This FAQ provides information, not financial advice. U2E rewards should not be considered:
- Investment returns
- Guaranteed income
- Financial products
- Securities

Consult a financial advisor before participating.

---

## Future Plans

### Will more businesses be added?

Yes. As the ecosystem grows:
- New businesses will join U2E
- Reward categories will expand
- Platform integrations will increase
- More earning opportunities emerge

### Will there be bonus multipliers?

Potential future features:
- Early adopter bonuses
- Consistency multipliers
- Volume-based tiers
- Referral rewards
- Special events/campaigns

All subject to governance approval.

### How can I suggest improvements?

Community input is valued:
- Join Discord/Telegram discussions
- Submit proposals via governance
- Participate in feedback surveys
- Engage with development team

---

## Getting Help

### Where can I get support?

- **Documentation**: [U2E Integration Guide](./U2E_INTEGRATION_GUIDE.md)
- **Discord**: [discord.gg/aaic](#)
- **Telegram**: [@aaic_support](#)
- **Email**: support@aaic.io
- **Support Portal**: https://support.aaic.io

### How do I report abuse or fraud?

Report suspicious activity:
- Email: security@aaic.io
- Support ticket: High priority
- Include: User ID, action details, evidence
- Response time: 24-48 hours

### Where can I track system status?

Check system health:
- Status page: https://status.aaic.io
- Twitter: [@aaic_status](#)
- Dashboard indicator
- API health endpoint

---

## Additional Resources

- [U2E Integration Guide](./U2E_INTEGRATION_GUIDE.md)
- [U2E Webhook API Documentation](./U2E_WEBHOOK_API.md)
- [U2E Testing Guide](./U2E_TESTING_GUIDE.md)
- [U2E Terms of Service](/legal/u2e-terms)
- [Risk Disclosure](/legal/risk-disclosure)

---

**Last Updated**: December 2024
**Version**: 1.0

For the most up-to-date information, always refer to the official documentation and announcements.
