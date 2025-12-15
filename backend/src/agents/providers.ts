import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentId, AgentMessage, AgentVoteMessage } from '../../../shared/types/index.js';

export interface LLMProvider {
  generateResponse(systemPrompt: string, userPrompt: string): Promise<string>;
}

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 60000; // 60 seconds

// Retry wrapper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  agentId: string,
  operationName: string
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a rate limit error
      const isRateLimit =
        error?.status === 429 ||
        error?.code === 'rate_limit_exceeded' ||
        error?.message?.toLowerCase().includes('rate limit');

      // Check if it's a retryable error
      const isRetryable =
        isRateLimit ||
        error?.status === 500 ||
        error?.status === 502 ||
        error?.status === 503 ||
        error?.status === 504 ||
        error?.code === 'ECONNRESET' ||
        error?.code === 'ETIMEDOUT';

      if (!isRetryable || attempt === MAX_RETRIES - 1) {
        console.error(`[${agentId}] ${operationName} failed after ${attempt + 1} attempts:`, {
          error: error.message,
          status: error.status,
          code: error.code,
          type: error.type
        });
        throw error;
      }

      // Calculate delay with exponential backoff
      let delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);

      // For rate limits, use longer delay
      if (isRateLimit) {
        delay = Math.min(delay * 2, MAX_RETRY_DELAY);
      }

      // Add jitter
      delay = delay + Math.random() * 1000;

      console.warn(`[${agentId}] ${operationName} failed (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${Math.round(delay)}ms...`, {
        error: error.message,
        status: error.status,
        isRateLimit
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export class ClaudeProvider implements LLMProvider {
  private client: Anthropic;
  private agentId: string = 'claude';

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    return retryWithBackoff(
      async () => {
        const response = await (this.client as any).messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        });

        const content = response.content[0];
        if (content.type === 'text') {
          return content.text;
        }
        throw new Error('Unexpected response format from Claude');
      },
      this.agentId,
      'Claude API call'
    );
  }
}

export class ChatGPTProvider implements LLMProvider {
  private client: OpenAI;
  private agentId: string = 'chatgpt';

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    return retryWithBackoff(
      async () => {
        const response = await this.client.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          max_tokens: 2000,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        });

        return response.choices[0]?.message?.content || '';
      },
      this.agentId,
      'ChatGPT API call'
    );
  }
}

export class GrokProvider implements LLMProvider {
  private client: OpenAI;
  private agentId: string = 'grok';

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.x.ai/v1'
    });
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    return retryWithBackoff(
      async () => {
        const response = await this.client.chat.completions.create({
          model: 'grok-beta',
          max_tokens: 2000,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        });

        return response.choices[0]?.message?.content || '';
      },
      this.agentId,
      'Grok API call'
    );
  }
}

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;
  private agentId: string = 'gemini';

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    return retryWithBackoff(
      async () => {
        const model = this.client.getGenerativeModel({
          model: 'gemini-pro'
        } as any);

        const prompt = `${systemPrompt}\n\n${userPrompt}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
      },
      this.agentId,
      'Gemini API call'
    );
  }
}

export class DeepSeekProvider implements LLMProvider {
  private client: OpenAI;
  private agentId: string = 'deepseek';

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com'
    });
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    return retryWithBackoff(
      async () => {
        const response = await this.client.chat.completions.create({
          model: 'deepseek-chat',
          max_tokens: 2000,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        });

        return response.choices[0]?.message?.content || '';
      },
      this.agentId,
      'DeepSeek API call'
    );
  }
}

export class QwenProvider implements LLMProvider {
  private client: OpenAI;
  private agentId: string = 'qwen';

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    });
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    return retryWithBackoff(
      async () => {
        const response = await this.client.chat.completions.create({
          model: 'qwen-max',
          max_tokens: 2000,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        });

        return response.choices[0]?.message?.content || '';
      },
      this.agentId,
      'Qwen API call'
    );
  }
}

export function createProvider(agentId: AgentId): LLMProvider {
  const apiKeys = {
    claude: process.env.ANTHROPIC_API_KEY!,
    chatgpt: process.env.OPENAI_API_KEY!,
    grok: process.env.GROK_API_KEY!,
    gemini: process.env.GEMINI_API_KEY!,
    deepseek: process.env.DEEPSEEK_API_KEY!,
    qwen: process.env.QWEN_API_KEY!
  };

  const providers = {
    claude: () => new ClaudeProvider(apiKeys.claude),
    chatgpt: () => new ChatGPTProvider(apiKeys.chatgpt),
    grok: () => new GrokProvider(apiKeys.grok),
    gemini: () => new GeminiProvider(apiKeys.gemini),
    deepseek: () => new DeepSeekProvider(apiKeys.deepseek),
    qwen: () => new QwenProvider(apiKeys.qwen)
  };

  return providers[agentId]();
}
