import { APIError, logError } from '@shared/lib';
import { WEBSITE_API } from './apiConfig';
import type { TopicWithDetails, PaginatedMessages, ProposalsResponse, ErrorsResponse } from '@shared/types/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText };
    }

    throw new APIError(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      response.statusText,
      errorData
    );
  }

  return response.json();
}

async function fetchWithRetry<T>(url: string, options?: RequestInit, retries = 2): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      return await handleResponse<T>(response);
    } catch (error: any) {
      lastError = error;

      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (i === retries) {
        throw error;
      }

      const delay = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export const api = {
  async getHome(): Promise<TopicWithDetails> {
    return fetchWithRetry<TopicWithDetails>(WEBSITE_API.topics.getCurrent(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async getMessages(topicId: string, limit: number = 50, offset: number = 0): Promise<PaginatedMessages> {
    return fetchWithRetry<PaginatedMessages>(WEBSITE_API.messages.getByTopic(topicId, limit, offset), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async getPlan(topicId: string): Promise<TopicWithDetails> {
    return fetchWithRetry<TopicWithDetails>(WEBSITE_API.topics.getById(topicId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async getProposals(status?: string): Promise<ProposalsResponse> {
    return fetchWithRetry<ProposalsResponse>(WEBSITE_API.proposals.getAll(status), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  logError
};

export { APIError };
