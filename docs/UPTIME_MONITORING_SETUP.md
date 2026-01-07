# Uptime Monitoring Setup (Post-Launch)

## Overview

This document outlines the setup process for implementing real-time uptime monitoring for all Aizura Foundation Businesses using UptimeRobot. This infrastructure should be implemented immediately after mainnet launch to provide transparent, verifiable uptime metrics to the community.

---

## Step 1: Create UptimeRobot Account

1. Sign up at [https://uptimerobot.com](https://uptimerobot.com)
   - Free plan supports 50 monitors (sufficient for initial needs)
   - 5-minute check intervals
   - 50 SMS alerts per month

2. Verify email address

3. Complete account setup

**Cost:** Free tier is sufficient for monitoring 4 foundation businesses + main websites

---

## Step 2: Add Monitors for Each Foundation Business

Create HTTP(S) monitors for the following services:

### Foundation Business Monitors

1. **AI Traders**
   - URL: `https://traders.aizura.ai`
   - Name: `Aizura - AI Traders`
   - Type: HTTPS
   - Interval: 5 minutes
   - Expected status: 200 OK

2. **AI Web Dev**
   - URL: `https://webdev.aizura.ai`
   - Name: `Aizura - AI Web Dev`
   - Type: HTTPS
   - Interval: 5 minutes
   - Expected status: 200 OK

3. **AI Business Factory**
   - URL: `https://factory.aizura.ai`
   - Name: `Aizura - AI Business Factory`
   - Type: HTTPS
   - Interval: 5 minutes
   - Expected status: 200 OK

4. **Coinfusion**
   - URL: `https://coinfusion.io`
   - Name: `Aizura - Coinfusion`
   - Type: HTTPS
   - Interval: 5 minutes
   - Expected status: 200 OK

### Platform Infrastructure Monitors

5. **Main Website**
   - URL: `https://aizura.ai`
   - Name: `Aizura - Main Website`
   - Type: HTTPS
   - Interval: 5 minutes

6. **Client Portal**
   - URL: `https://client.aizura.ai`
   - Name: `Aizura - Client Portal`
   - Type: HTTPS
   - Interval: 5 minutes

7. **DAO Portal**
   - URL: `https://dao.aizura.ai`
   - Name: `Aizura - DAO Portal`
   - Type: HTTPS
   - Interval: 5 minutes

8. **API Backend**
   - URL: `https://api.aizura.ai/health`
   - Name: `Aizura - API Backend`
   - Type: HTTPS
   - Interval: 1 minute (critical infrastructure)

---

## Step 3: Create Public Status Page

### Enable Public Status Page

1. Navigate to Dashboard → Status Pages
2. Click "Create Status Page"
3. Configure settings:
   - **Name:** Aizura Consortium Status
   - **Custom Domain:** `status.aizura.ai`
   - **Logo:** Upload Aizura logo
   - **Color Theme:** Match brand colors (cyan/blue)

### Add Monitors to Status Page

1. Select all 8 monitors created in Step 2
2. Enable public visibility
3. Show response times
4. Enable incident history (last 90 days)

### Custom Domain Setup

1. Add CNAME record in DNS:
   ```
   status.aizura.ai → stats.uptimerobot.com
   ```

2. Wait for DNS propagation (up to 48 hours)

3. Verify custom domain in UptimeRobot dashboard

---

## Step 4: Update Website References

### Replace Mock Claims with Live Data

#### Foundation Businesses Page (`/website/pages/portfolio/FoundationBusinesses.tsx`)

**Before:**
```tsx
<div className="text-sm text-slate-400">98%+ uptime target</div>
```

**After:**
```tsx
<a
  href="https://status.aizura.ai"
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-green-400 hover:underline flex items-center gap-1"
>
  <Activity className="w-3 h-3" />
  View Live Uptime
</a>
```

#### Methodology Page (`/website/pages/resources/Methodology.tsx`)

**Add Section:**
```tsx
<div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
  <h3 className="text-xl font-bold text-white mb-4">
    Real-Time Uptime Monitoring
  </h3>
  <p className="text-slate-300 mb-4">
    All uptime claims are verified by third-party monitoring service UptimeRobot.
    View our public status page for real-time metrics and incident history.
  </p>
  <a
    href="https://status.aizura.ai"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600
               text-white rounded-lg transition-colors"
  >
    <ExternalLink className="w-4 h-4" />
    View Status Page
  </a>
</div>
```

#### Home Page Hero (`/website/pages/Home.tsx`)

Add uptime badge:
```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
  <a
    href="https://status.aizura.ai"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-slate-300 hover:text-cyan-400 transition-colors"
  >
    All Systems Operational
  </a>
</div>
```

---

## Step 5: Set Alert Thresholds

### Email Alerts

Configure alert contacts:
1. Navigate to My Settings → Alert Contacts
2. Add team email: `alerts@aizura.ai`
3. Add ops team members individually

### Alert Conditions

**Immediate Alerts (Critical):**
- API Backend down (any service)
- 2+ foundation businesses down simultaneously
- Main website down

**Warning Alerts (Review Required):**
- Any single business down >5 minutes
- Response time >2000ms sustained for 15+ minutes
- SSL certificate expiring in <30 days

**Weekly Reports:**
- Send to: `team@aizura.ai`
- Include: Uptime percentages, average response times, incident summary

### Slack Integration (Recommended)

1. Create Slack webhook in workspace
2. Add webhook URL to UptimeRobot alert contacts
3. Configure real-time notifications for:
   - Any service going down
   - Any service coming back up
   - Response time spikes

---

## Step 6: Implement Automated Uptime Tracking

### Create Supabase Table

```sql
CREATE TABLE uptime_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  uptime_percentage DECIMAL(5,2) NOT NULL,
  average_response_time_ms INTEGER,
  incidents_count INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_uptime_business ON uptime_metrics(business_name, period_start DESC);
```

### Set Up Daily Import Job

Use UptimeRobot API to import daily metrics:

```typescript
// /backend/shared/jobs/importUptimeMetrics.ts
import { supabase } from '../../shared/lib/supabase';

const UPTIMEROBOT_API_KEY = process.env.UPTIMEROBOT_API_KEY;

export async function importDailyUptimeMetrics() {
  const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: UPTIMEROBOT_API_KEY,
      format: 'json',
      logs: 1,
      custom_uptime_ranges: '30-60-90' // Last 30, 60, 90 days
    })
  });

  const data = await response.json();

  for (const monitor of data.monitors) {
    await supabase.from('uptime_metrics').insert({
      business_name: monitor.friendly_name,
      uptime_percentage: parseFloat(monitor.custom_uptime_ranges),
      average_response_time_ms: monitor.average_response_time,
      incidents_count: monitor.logs?.length || 0,
      period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      period_end: new Date()
    });
  }
}

// Run daily at 00:00 UTC
```

---

## Step 7: Create Uptime Dashboard Widget

### Website Component: UptimeWidget.tsx

```tsx
// /website/components/metrics/UptimeWidget.tsx
import { useEffect, useState } from 'react';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'unknown';
  uptime: string;
  responseTime: number;
}

export function UptimeWidget() {
  const [services, setServices] = useState<ServiceStatus[]>([]);

  useEffect(() => {
    // Fetch from UptimeRobot API or Supabase cache
    async function loadStatuses() {
      const response = await fetch('/api/uptime-status');
      const data = await response.json();
      setServices(data);
    }

    loadStatuses();
    const interval = setInterval(loadStatuses, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        System Status
      </h3>

      <div className="space-y-3">
        {services.map(service => (
          <div key={service.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {service.status === 'up' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-slate-300">{service.name}</span>
            </div>
            <span className="text-xs text-slate-500">
              {service.uptime} uptime
            </span>
          </div>
        ))}
      </div>

      <a
        href="https://status.aizura.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-cyan-400 hover:underline mt-4 inline-block"
      >
        View detailed status →
      </a>
    </div>
  );
}
```

---

## Step 8: Post-Launch Verification Checklist

### Week 1 After Launch

- [ ] Verify all 8 monitors are active and reporting correctly
- [ ] Confirm public status page is accessible at `status.aizura.ai`
- [ ] Test email alerts by triggering a test incident
- [ ] Verify Slack notifications are working
- [ ] Check that website links to status page are functional
- [ ] Confirm uptime data is being imported to Supabase daily

### Week 2-4 After Launch

- [ ] Review first 30 days of uptime data
- [ ] Identify any recurring issues or patterns
- [ ] Adjust alert thresholds if needed (too many/few alerts)
- [ ] Create first "Monthly Uptime Report" for community
- [ ] Update Methodology page with actual uptime percentages

### Ongoing Maintenance

- [ ] Weekly review of uptime reports
- [ ] Monthly post-mortem for any major incidents
- [ ] Quarterly review of monitoring coverage (add new services as they launch)
- [ ] Annual UptimeRobot subscription renewal (if upgraded from free tier)

---

## Cost Considerations

### Free Tier (Current)
- 50 monitors
- 5-minute intervals
- 50 SMS alerts/month
- 2-month log retention

**Cost:** $0/month

### Pro Tier (Future Growth)
- 200 monitors
- 1-minute intervals
- Unlimited SMS alerts
- 1-year log retention
- Advanced analytics

**Cost:** $58/month (upgrade when foundation businesses exceed 50)

---

## Troubleshooting Common Issues

### Monitor Shows "Down" But Service is Accessible

**Possible causes:**
1. Geographic routing issues (UptimeRobot server location)
2. Rate limiting blocking monitoring IPs
3. Temporary DNS issues

**Solution:**
- Whitelist UptimeRobot IPs in firewall
- Add multiple monitors from different regions
- Increase timeout threshold in monitor settings

### High False-Positive Rate

**Possible causes:**
1. Aggressive timeout settings
2. Server under heavy load
3. Network congestion

**Solution:**
- Increase timeout from 30s to 60s
- Add retry logic (check 2x before alerting)
- Optimize server response times

### SSL Certificate Alerts

**Possible causes:**
1. Expired certificate
2. Certificate chain issues
3. Renewal process failed

**Solution:**
- Set up auto-renewal with Let's Encrypt
- Monitor certificate expiration dates
- Have backup certificates ready

---

## Integration with Analytics Dashboard

Once live, integrate uptime metrics into the main analytics dashboard:

```typescript
// Example integration
import { getAverageUptime } from '../utils/analytics';

<LiveMetricCard
  fetchFunction={getAverageUptime}
  refreshInterval={60000}
/>
```

This displays real-time uptime percentage from UptimeRobot, updating every minute.

---

## Security & Privacy Considerations

### Public Status Page

**What to show:**
- Service names (generic: "AI Traders", not internal service names)
- Uptime percentages
- Response times
- Incident history (summary only, no technical details)

**What NOT to show:**
- Server IPs or hostnames
- Technical error messages
- Infrastructure details
- Internal service dependencies

### API Key Security

Store UptimeRobot API key securely:
```bash
# .env
UPTIMEROBOT_API_KEY=your_read_only_api_key_here
```

Use read-only API key for public integrations. Keep full-access key in team password manager only.

---

## Post-Launch Communication

### Announcement Template

```markdown
🚀 Introducing Real-Time Uptime Monitoring

We're committed to complete transparency. All uptime claims are now verified
by third-party monitoring service UptimeRobot.

📊 View our public status page: https://status.aizura.ai

What you'll find:
- Real-time status for all foundation businesses
- Historical uptime data (90 days)
- Incident reports and post-mortems
- Average response times

No more "trust us" — verify everything yourself.

#Transparency #Aizura
```

---

## Summary

This uptime monitoring infrastructure provides:

1. **Transparency:** Public status page with real-time data
2. **Accountability:** Third-party verification of uptime claims
3. **Reliability:** Automated alerts for immediate incident response
4. **Trust:** Community can verify performance independently

**Action Items:**
1. Set up UptimeRobot account immediately after mainnet launch
2. Configure all 8 monitors within first week
3. Update website references to link to live status page
4. Set up daily import job to track metrics in Supabase
5. Create uptime widget for homepage

**Timeline:** Complete setup within 7 days of mainnet launch.
