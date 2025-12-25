# Airdrop OAuth Setup Guide

This guide walks you through setting up OAuth integrations for the Aizura Airdrop system. Users will connect their social accounts to earn points and climb the leaderboard.

## Prerequisites

- Access to Aizura production server
- Admin access to create OAuth applications
- Official Aizura social accounts created on all platforms

---

## 1. Twitter OAuth 2.0 Setup (15 minutes)

### Step 1: Create Twitter Developer Account
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign in with your Twitter account
3. Apply for a developer account (if you don't have one)
4. Complete the application form

### Step 2: Create New App
1. Click **"+ Create Project"**
2. Project Name: `Aizura Airdrop`
3. Use Case: **"Making a bot"**
4. Project Description: `OAuth integration for Aizura airdrop social verification`
5. Click **"Next"**

### Step 3: Configure App Settings
1. App Name: `Aizura Airdrop`
2. Click **"App Settings"** → **"Set up"** under "User authentication settings"
3. Enable **OAuth 2.0**
4. Type of App: **Web App**
5. App Permissions:
   - ✅ Read
6. Callback URL / Redirect URL:
   ```
   https://aizura.ai/api/client/airdrop/connect/twitter/callback
   ```
7. Website URL: `https://aizura.ai`
8. Click **"Save"**

### Step 4: Get Credentials
1. Go to **"Keys and tokens"** tab
2. Copy **Client ID**
3. Copy **Client Secret** (show and copy immediately - won't be shown again)

### Step 5: Get Official Twitter Account ID
1. Go to [Twitter User ID Lookup](https://tweeterid.com/)
2. Enter your official Twitter handle (e.g., `@AizuraAI`)
3. Copy the numeric User ID

### Step 6: Add to Environment Variables
Add these to your `.env` file:
```bash
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here
OFFICIAL_TWITTER_USERNAME=AizuraAI
OFFICIAL_TWITTER_ID=1234567890123456789
```

---

## 2. Discord OAuth Setup (10 minutes)

### Step 1: Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Sign in with your Discord account
3. Click **"New Application"**
4. Name: `Aizura Airdrop`
5. Agree to terms and click **"Create"**

### Step 2: Configure OAuth2
1. Click **"OAuth2"** in the left sidebar
2. Click **"Add Redirect"** under "Redirects"
3. Add callback URL:
   ```
   https://aizura.ai/api/client/airdrop/connect/discord/callback
   ```
4. Click **"Save Changes"**

### Step 3: Get Credentials
1. Copy **Client ID** (shown at top)
2. Click **"Reset Secret"** to generate a new Client Secret
3. Copy **Client Secret** (copy immediately - won't be shown again)

### Step 4: Get Discord Server ID
1. Open Discord app
2. Go to **User Settings** → **Advanced**
3. Enable **Developer Mode**
4. Right-click your official Aizura server
5. Click **"Copy Server ID"**

### Step 5: Add to Environment Variables
Add these to your `.env` file:
```bash
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
OFFICIAL_DISCORD_SERVER_ID=1234567890123456789
OFFICIAL_DISCORD_SERVER_NAME=Aizura
```

---

## 3. GitHub OAuth Setup (8 minutes)

### Step 1: Create OAuth App
1. Go to [GitHub Settings → Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in left sidebar
3. Click **"New OAuth App"**

### Step 2: Configure Application
1. Application name: `Aizura Airdrop`
2. Homepage URL: `https://aizura.ai`
3. Application description: `Aizura airdrop social verification system`
4. Authorization callback URL:
   ```
   https://aizura.ai/api/client/airdrop/connect/github/callback
   ```
5. Click **"Register application"**

### Step 3: Get Credentials
1. Copy **Client ID** (shown on page)
2. Click **"Generate a new client secret"**
3. Copy **Client Secret** (copy immediately - won't be shown again)

### Step 4: Add to Environment Variables
Add these to your `.env` file:
```bash
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
OFFICIAL_GITHUB_ORG=aizura-ai
```

**Note:** If you want to verify GitHub organization membership, create a GitHub organization and set `OFFICIAL_GITHUB_ORG` to your org name.

---

## 4. Telegram Bot Setup (5 minutes)

### Step 1: Create Bot via BotFather
1. Open Telegram app
2. Search for **@BotFather**
3. Start a chat and send: `/newbot`
4. Follow the prompts:
   - Bot name: `Aizura Airdrop Bot`
   - Bot username: `AizuraAirdropBot` (must end in 'bot')

### Step 2: Get Bot Token
1. BotFather will provide a token like:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
2. **Copy this token immediately and securely**

### Step 3: Configure Bot Settings
1. Send `/setdescription` to BotFather
2. Select your bot
3. Description: `Verify your Telegram account for Aizura airdrop points`
4. Send `/setabouttext` to BotFather
5. About text: `Official Aizura airdrop verification bot`

### Step 4: Set Bot Commands (Optional)
1. Send `/setcommands` to BotFather
2. Select your bot
3. Enter commands:
   ```
   start - Start verification process
   verify - Verify your account
   status - Check verification status
   help - Get help
   ```

### Step 5: Get Telegram Channel Details
1. Create official Aizura Telegram channel (if not exists)
2. Channel username (e.g., `@AizuraOfficial`)
3. To get channel ID:
   - Add your bot as an admin to the channel
   - Send a message in the channel
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `"chat":{"id":-1001234567890}` in the response

### Step 6: Add to Environment Variables
Add these to your `.env` file:
```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=AizuraAirdropBot
OFFICIAL_TELEGRAM_CHANNEL=-1001234567890
OFFICIAL_TELEGRAM_CHANNEL_USERNAME=AizuraOfficial
```

---

## 5. Configure Base Settings

### Step 1: Set API Base URL
Add to your `.env` file:
```bash
API_BASE_URL=https://aizura.ai
```

For local development, use:
```bash
API_BASE_URL=http://localhost:3001
```

### Step 2: Full Environment Variables Checklist

Create or update your `.env` file with all these variables:

```bash
# API Configuration
API_BASE_URL=https://aizura.ai

# Twitter OAuth 2.0
TWITTER_CLIENT_ID=xxxxxxxxxxxxx
TWITTER_CLIENT_SECRET=xxxxxxxxxxxxx
OFFICIAL_TWITTER_USERNAME=AizuraAI
OFFICIAL_TWITTER_ID=1234567890123456789

# Discord OAuth
DISCORD_CLIENT_ID=xxxxxxxxxxxxx
DISCORD_CLIENT_SECRET=xxxxxxxxxxxxx
OFFICIAL_DISCORD_SERVER_ID=1234567890123456789
OFFICIAL_DISCORD_SERVER_NAME=Aizura

# GitHub OAuth
GITHUB_CLIENT_ID=xxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxx
OFFICIAL_GITHUB_ORG=aizura-ai

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=AizuraAirdropBot
OFFICIAL_TELEGRAM_CHANNEL=-1001234567890
OFFICIAL_TELEGRAM_CHANNEL_USERNAME=AizuraOfficial
```

---

## 6. Testing OAuth Flows

### Test Twitter OAuth
1. Navigate to airdrop page: `https://aizura.ai/dashboard/airdrop`
2. Click **"Connect Twitter"** button
3. Should redirect to Twitter authorization page
4. Approve the app
5. Should redirect back with success message
6. Verify connection shows in social connections panel

### Test Discord OAuth
1. Click **"Connect Discord"** button
2. Should redirect to Discord authorization page
3. Click **"Authorize"**
4. Should redirect back with success message
5. Verify connection shows in social connections panel

### Test GitHub OAuth
1. Click **"Connect GitHub"** button
2. Should redirect to GitHub authorization page
3. Click **"Authorize [your-app-name]"**
4. Should redirect back with success message
5. Verify connection shows in social connections panel

### Test Telegram Bot
1. Click **"Connect Telegram"** button
2. Should open Telegram deep link or show instructions
3. Start bot conversation
4. Send `/start` command
5. Bot should provide verification link
6. Complete verification
7. Verify connection shows in social connections panel

---

## 7. Verification Testing

### Test Social Following/Membership
1. **Twitter:** Use test account to follow @AizuraAI, click "Verify Follow" button
2. **Discord:** Join official Discord server, click "Verify Membership" button
3. **Telegram:** Subscribe to @AizuraOfficial channel, click "Verify Subscription" button
4. **GitHub:** Star official repository or join org, click "Verify" button

### Verify Points Awarded
1. Check that points are awarded correctly:
   - Twitter Connection: 150 points
   - Twitter Follow: 75 points
   - Discord Connection: 150 points
   - Discord Member: 50 points
   - Telegram Connection: 100 points
   - Telegram Subscription: 50 points
   - GitHub Connection: 100 points

2. Navigate to leaderboard and verify rank updates

---

## 8. Security Best Practices

### Secure Token Storage
- All OAuth secrets are stored in environment variables
- Never commit `.env` file to version control
- Use secure key management in production (e.g., AWS Secrets Manager, Vault)

### Callback URL Validation
- All callback URLs must match exactly what's configured in OAuth apps
- Use HTTPS in production (never HTTP)
- Verify state parameter on all callbacks to prevent CSRF

### Token Rotation
- Rotate OAuth client secrets periodically (every 90 days)
- Monitor for suspicious OAuth activity
- Implement rate limiting on OAuth endpoints

### User Privacy
- Only request minimum required OAuth scopes
- Don't store unnecessary user data
- Allow users to disconnect at any time
- Clear tokens when user disconnects

---

## 9. Troubleshooting

### Common Issues

**"OAuth not configured" error**
- Check that environment variables are set correctly
- Restart backend server after adding env vars
- Verify no typos in variable names

**"Redirect URI mismatch" error**
- Verify callback URL matches exactly in OAuth app settings
- Check for trailing slashes (some providers are strict)
- Ensure using HTTPS in production

**"Invalid client credentials" error**
- Regenerate client secret
- Check that client ID and secret are correct
- Ensure no extra spaces when copying credentials

**Twitter "Invalid code verifier" error**
- Using PKCE flow - ensure code verifier matches challenge
- Currently using simple "challenge" string - update for production

**Discord "Invalid OAuth2 state" error**
- State parameter validation failing
- Check that state encoding/decoding is working
- Verify state hasn't expired

**Telegram hash verification failing**
- Check bot token is correct
- Verify hash calculation matches Telegram's algorithm
- Ensure auth_date is within 24 hours

---

## 10. Monitoring & Maintenance

### Monitor OAuth Health
- Track OAuth success/failure rates
- Log all OAuth errors for debugging
- Set up alerts for high failure rates

### Regular Tasks
- [ ] Review OAuth error logs weekly
- [ ] Rotate OAuth secrets quarterly
- [ ] Test all OAuth flows monthly
- [ ] Update OAuth app descriptions/logos
- [ ] Review and update required scopes

### Analytics to Track
- OAuth connection rate by platform
- OAuth failure rate by platform
- Time to complete OAuth flow
- Points awarded per platform
- Social verification completion rate

---

## 11. Production Checklist

Before launching to production:

- [ ] All OAuth apps created and configured
- [ ] All environment variables set in production
- [ ] All callback URLs point to production domain (HTTPS)
- [ ] OAuth flows tested on production environment
- [ ] Error logging and monitoring configured
- [ ] Rate limiting implemented on OAuth endpoints
- [ ] Security review completed
- [ ] User documentation created
- [ ] Support team trained on OAuth issues
- [ ] Backup OAuth credentials stored securely

---

## 12. Support & Resources

### OAuth Documentation
- [Twitter OAuth 2.0 Docs](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [Discord OAuth2 Docs](https://discord.com/developers/docs/topics/oauth2)
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Telegram Login Widget Docs](https://core.telegram.org/widgets/login)

### Getting Help
- Check error logs first: `backend/logs/oauth-errors.log`
- Review OAuth configuration: Run validation script
- Test with curl commands to isolate issues
- Contact platform support if platform is down

---

## Summary

You should now have:
- ✅ Twitter OAuth app configured
- ✅ Discord OAuth app configured
- ✅ GitHub OAuth app configured
- ✅ Telegram bot created and configured
- ✅ All environment variables set
- ✅ OAuth flows tested and working
- ✅ Points awarded correctly
- ✅ Monitoring and logging in place

**Estimated Setup Time:** 40-50 minutes total

Once complete, users can connect their social accounts and start earning airdrop points immediately!
