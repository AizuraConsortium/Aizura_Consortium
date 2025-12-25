/**
 * U2E Webhook Testing Tool
 *
 * Sends test events to U2E webhook endpoints to validate integration.
 *
 * Usage:
 *   tsx scripts/u2e/testWebhook.ts --url=http://localhost:3001 --api-key=your-key
 *   tsx scripts/u2e/testWebhook.ts --preset=ai-traders
 */

import fetch from 'node-fetch';

interface WebhookTestOptions {
  url: string;
  apiKey: string;
  preset?: string;
}

interface TestEvent {
  userId: string;
  businessName: string;
  actionType: string;
  metadata?: Record<string, any>;
}

const TEST_PRESETS: Record<string, TestEvent[]> = {
  'ai-traders': [
    {
      userId: 'test-user-1',
      businessName: 'AI Traders',
      actionType: 'trade_executed',
      metadata: { symbol: 'BTC/USD', amount: 100 },
    },
    {
      userId: 'test-user-1',
      businessName: 'AI Traders',
      actionType: 'profitable_trade',
      metadata: { profit: 50 },
    },
  ],
  'ai-business-factory': [
    {
      userId: 'test-user-2',
      businessName: 'AI Business Factory',
      actionType: 'business_created',
      metadata: { businessName: 'Test SaaS' },
    },
  ],
  'ai-web-dev': [
    {
      userId: 'test-user-3',
      businessName: 'AI Web Dev',
      actionType: 'project_completed',
      metadata: { projectName: 'E-commerce Site' },
    },
  ],
};

export class WebhookTester {
  private options: WebhookTestOptions;
  private results: Array<{ event: TestEvent; success: boolean; response?: any; error?: string }> = [];

  constructor(options: WebhookTestOptions) {
    this.options = options;
  }

  async test(events: TestEvent[]) {
    console.log(`Testing ${events.length} webhook events...`);
    console.log(`Endpoint: ${this.options.url}/api/u2e/track`);
    console.log();

    for (const event of events) {
      await this.testEvent(event);
    }

    this.printSummary();
  }

  private async testEvent(event: TestEvent) {
    console.log(`Testing: ${event.businessName} - ${event.actionType}`);

    try {
      const response = await fetch(`${this.options.url}/api/u2e/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.options.apiKey,
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`  ✅ Success:`, data);
        this.results.push({ event, success: true, response: data });
      } else {
        console.log(`  ❌ Failed:`, data);
        this.results.push({ event, success: false, response: data });
      }
    } catch (error) {
      console.log(`  ❌ Error:`, (error as Error).message);
      this.results.push({ event, success: false, error: (error as Error).message });
    }

    console.log();
  }

  private printSummary() {
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;

    console.log('─'.repeat(60));
    console.log('SUMMARY');
    console.log('─'.repeat(60));
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log();

    if (failed > 0) {
      console.log('Failed Events:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.event.businessName} / ${r.event.actionType}`);
          console.log(`    Error: ${r.error || JSON.stringify(r.response)}`);
        });
    }
  }

  async testIdempotency(event: TestEvent) {
    console.log('Testing idempotency...');
    console.log(`Sending same event twice`);

    const results = [];

    for (let i = 0; i < 2; i++) {
      console.log(`Attempt ${i + 1}:`);
      try {
        const response = await fetch(`${this.options.url}/api/u2e/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.options.apiKey,
          },
          body: JSON.stringify(event),
        });

        const data = await response.json();
        results.push({ status: response.status, data });
        console.log(`  Status: ${response.status}, Response:`, data);
      } catch (error) {
        console.log(`  Error:`, (error as Error).message);
      }
    }

    console.log();
    if (results.length === 2 && results[0].status === 200 && results[1].data.error) {
      console.log('✅ Idempotency working correctly');
    } else {
      console.log('❌ Idempotency may not be working as expected');
    }
  }

  async testAuthentication() {
    console.log('Testing authentication...');

    try {
      const response = await fetch(`${this.options.url}/api/u2e/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test',
          businessName: 'AI Traders',
          actionType: 'trade_executed',
        }),
      });

      if (response.status === 401 || response.status === 403) {
        console.log('✅ Authentication required (good)');
      } else {
        console.log('❌ No authentication required (security issue!)');
      }
    } catch (error) {
      console.log('❌ Request failed:', (error as Error).message);
    }

    console.log();
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let url = 'http://localhost:3001';
  let apiKey = '';
  let preset = 'ai-traders';
  let testIdempotency = false;
  let testAuth = false;

  args.forEach(arg => {
    if (arg.startsWith('--url=')) {
      url = arg.split('=')[1];
    } else if (arg.startsWith('--api-key=')) {
      apiKey = arg.split('=')[1];
    } else if (arg.startsWith('--preset=')) {
      preset = arg.split('=')[1];
    } else if (arg === '--test-idempotency') {
      testIdempotency = true;
    } else if (arg === '--test-auth') {
      testAuth = true;
    }
  });

  if (!apiKey) {
    console.error('❌ Error: --api-key is required');
    process.exit(1);
  }

  const tester = new WebhookTester({ url, apiKey, preset });

  (async () => {
    try {
      if (testAuth) {
        await tester.testAuthentication();
      }

      if (testIdempotency) {
        const event = TEST_PRESETS[preset]?.[0];
        if (event) {
          await tester.testIdempotency(event);
        }
      }

      const events = TEST_PRESETS[preset];
      if (!events) {
        console.error(`❌ Unknown preset: ${preset}`);
        console.log('Available presets:', Object.keys(TEST_PRESETS).join(', '));
        process.exit(1);
      }

      await tester.test(events);
      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error);
      process.exit(1);
    }
  })();
}
