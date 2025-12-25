import { SupabaseClient } from '@supabase/supabase-js';

interface LoadTestConfig {
  totalUsers: number;
  concurrentRequests: number;
  testDurationSeconds: number;
}

interface LoadTestResult {
  scenario: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errors: string[];
}

export class AirdropLoadTester {
  private supabase: SupabaseClient;
  private results: LoadTestResult[] = [];

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async testLeaderboardLoad(usersCount: number = 10000): Promise<LoadTestResult> {
    console.log(`\n[Load Test] Testing leaderboard with ${usersCount} users...`);

    const result: LoadTestResult = {
      scenario: 'Leaderboard Query',
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      errors: [],
    };

    const responseTimes: number[] = [];
    const testDuration = 30000;
    const requestInterval = 100;
    const startTime = Date.now();

    console.log('Simulating concurrent leaderboard requests...');

    while (Date.now() - startTime < testDuration) {
      const requestStartTime = Date.now();
      result.totalRequests++;

      try {
        const { data, error } = await this.supabase
          .from('airdrop_leaderboard')
          .select('user_id, score, rank')
          .order('score', { ascending: false })
          .limit(100);

        const responseTime = Date.now() - requestStartTime;
        responseTimes.push(responseTime);

        if (error) {
          result.failedRequests++;
          result.errors.push(error.message);
        } else {
          result.successfulRequests++;
          result.minResponseTime = Math.min(result.minResponseTime, responseTime);
          result.maxResponseTime = Math.max(result.maxResponseTime, responseTime);
        }
      } catch (error) {
        result.failedRequests++;
        result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      }

      await this.sleep(requestInterval);
    }

    const totalDuration = (Date.now() - startTime) / 1000;
    result.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    result.requestsPerSecond = result.totalRequests / totalDuration;

    this.results.push(result);
    return result;
  }

  async testContentSubmissionLoad(submissionsCount: number = 1000): Promise<LoadTestResult> {
    console.log(`\n[Load Test] Testing content submissions with ${submissionsCount} submissions...`);

    const result: LoadTestResult = {
      scenario: 'Content Submissions',
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      errors: [],
    };

    const responseTimes: number[] = [];
    const testDuration = 30000;
    const requestInterval = 50;
    const startTime = Date.now();

    const { data: testUsers } = await this.supabase
      .from('users')
      .select('id')
      .limit(100);

    if (!testUsers || testUsers.length === 0) {
      result.errors.push('No test users available');
      return result;
    }

    console.log('Simulating concurrent content submission requests...');

    while (Date.now() - startTime < testDuration) {
      const requestStartTime = Date.now();
      result.totalRequests++;

      const randomUser = testUsers[Math.floor(Math.random() * testUsers.length)];

      try {
        const { error } = await this.supabase
          .from('content_submissions')
          .insert({
            user_id: randomUser.id,
            content_type: 'thread',
            title: `Load Test Submission ${Date.now()}`,
            url: `https://example.com/test-${Date.now()}`,
            description: 'Load testing submission',
            status: 'pending',
          });

        const responseTime = Date.now() - requestStartTime;
        responseTimes.push(responseTime);

        if (error) {
          result.failedRequests++;
          result.errors.push(error.message);
        } else {
          result.successfulRequests++;
          result.minResponseTime = Math.min(result.minResponseTime, responseTime);
          result.maxResponseTime = Math.max(result.maxResponseTime, responseTime);
        }
      } catch (error) {
        result.failedRequests++;
        result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      }

      await this.sleep(requestInterval);
    }

    const totalDuration = (Date.now() - startTime) / 1000;
    result.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    result.requestsPerSecond = result.totalRequests / totalDuration;

    this.results.push(result);
    return result;
  }

  async testPointTransactionsLoad(transactionsCount: number = 100000): Promise<LoadTestResult> {
    console.log(`\n[Load Test] Testing point transactions with ${transactionsCount} target transactions...`);

    const result: LoadTestResult = {
      scenario: 'Point Transactions',
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      errors: [],
    };

    const responseTimes: number[] = [];
    const testDuration = 30000;
    const requestInterval = 20;
    const startTime = Date.now();

    const { data: testUsers } = await this.supabase
      .from('users')
      .select('id')
      .limit(100);

    if (!testUsers || testUsers.length === 0) {
      result.errors.push('No test users available');
      return result;
    }

    console.log('Simulating concurrent point transaction writes...');

    while (Date.now() - startTime < testDuration) {
      const requestStartTime = Date.now();
      result.totalRequests++;

      const randomUser = testUsers[Math.floor(Math.random() * testUsers.length)];

      try {
        const { error } = await this.supabase
          .from('point_transactions')
          .insert({
            user_id: randomUser.id,
            amount: 10,
            reason: 'Load test transaction',
            reference_type: 'daily_login',
          });

        const responseTime = Date.now() - requestStartTime;
        responseTimes.push(responseTime);

        if (error) {
          result.failedRequests++;
          result.errors.push(error.message);
        } else {
          result.successfulRequests++;
          result.minResponseTime = Math.min(result.minResponseTime, responseTime);
          result.maxResponseTime = Math.max(result.maxResponseTime, responseTime);
        }
      } catch (error) {
        result.failedRequests++;
        result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      }

      await this.sleep(requestInterval);
    }

    const totalDuration = (Date.now() - startTime) / 1000;
    result.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    result.requestsPerSecond = result.totalRequests / totalDuration;

    this.results.push(result);
    return result;
  }

  async testConcurrentUserStats(concurrentUsers: number = 500): Promise<LoadTestResult> {
    console.log(`\n[Load Test] Testing ${concurrentUsers} concurrent user stats requests...`);

    const result: LoadTestResult = {
      scenario: 'Concurrent User Stats',
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      errors: [],
    };

    const responseTimes: number[] = [];
    const startTime = Date.now();

    const { data: testUsers } = await this.supabase
      .from('users')
      .select('id')
      .limit(concurrentUsers);

    if (!testUsers || testUsers.length === 0) {
      result.errors.push('No test users available');
      return result;
    }

    console.log('Simulating concurrent user stats queries...');

    const requests = testUsers.map(async (user) => {
      const requestStartTime = Date.now();
      result.totalRequests++;

      try {
        const { data, error } = await this.supabase
          .from('airdrop_leaderboard')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        const responseTime = Date.now() - requestStartTime;
        responseTimes.push(responseTime);

        if (error) {
          result.failedRequests++;
          result.errors.push(error.message);
        } else {
          result.successfulRequests++;
          result.minResponseTime = Math.min(result.minResponseTime, responseTime);
          result.maxResponseTime = Math.max(result.maxResponseTime, responseTime);
        }
      } catch (error) {
        result.failedRequests++;
        result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      }
    });

    await Promise.all(requests);

    const totalDuration = (Date.now() - startTime) / 1000;
    result.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    result.requestsPerSecond = result.totalRequests / totalDuration;

    this.results.push(result);
    return result;
  }

  async runAllTests(): Promise<LoadTestResult[]> {
    console.log('===================================');
    console.log('AIRDROP SYSTEM LOAD TESTING');
    console.log('===================================');

    await this.testLeaderboardLoad(10000);
    await this.testContentSubmissionLoad(1000);
    await this.testPointTransactionsLoad(100000);
    await this.testConcurrentUserStats(500);

    this.printResults();

    return this.results;
  }

  private printResults(): void {
    console.log('\n\n===================================');
    console.log('LOAD TEST RESULTS SUMMARY');
    console.log('===================================\n');

    this.results.forEach((result) => {
      console.log(`\n${result.scenario}:`);
      console.log(`  Total Requests: ${result.totalRequests}`);
      console.log(`  Successful: ${result.successfulRequests} (${((result.successfulRequests / result.totalRequests) * 100).toFixed(2)}%)`);
      console.log(`  Failed: ${result.failedRequests} (${((result.failedRequests / result.totalRequests) * 100).toFixed(2)}%)`);
      console.log(`  Avg Response Time: ${result.averageResponseTime.toFixed(2)}ms`);
      console.log(`  Min Response Time: ${result.minResponseTime.toFixed(2)}ms`);
      console.log(`  Max Response Time: ${result.maxResponseTime.toFixed(2)}ms`);
      console.log(`  Requests/Second: ${result.requestsPerSecond.toFixed(2)}`);

      if (result.errors.length > 0) {
        console.log(`  Errors (first 5):`);
        result.errors.slice(0, 5).forEach((error, i) => {
          console.log(`    ${i + 1}. ${error}`);
        });
      }

      this.printPerformanceRating(result);
    });

    console.log('\n===================================\n');
  }

  private printPerformanceRating(result: LoadTestResult): void {
    const successRate = (result.successfulRequests / result.totalRequests) * 100;
    const avgResponseTime = result.averageResponseTime;

    let rating = 'UNKNOWN';
    let emoji = '❓';

    if (successRate >= 99 && avgResponseTime < 100) {
      rating = 'EXCELLENT';
      emoji = '🟢';
    } else if (successRate >= 95 && avgResponseTime < 200) {
      rating = 'GOOD';
      emoji = '🔵';
    } else if (successRate >= 90 && avgResponseTime < 500) {
      rating = 'ACCEPTABLE';
      emoji = '🟡';
    } else if (successRate >= 80 && avgResponseTime < 1000) {
      rating = 'POOR';
      emoji = '🟠';
    } else {
      rating = 'CRITICAL';
      emoji = '🔴';
    }

    console.log(`  Performance Rating: ${emoji} ${rating}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export async function runAirdropLoadTests(supabase: SupabaseClient): Promise<void> {
  const tester = new AirdropLoadTester(supabase);
  await tester.runAllTests();
}
