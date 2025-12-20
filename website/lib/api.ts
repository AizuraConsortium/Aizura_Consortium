import { APIError, logError } from '@shared/lib';
import { WEBSITE_API } from './apiConfig';
import type { TopicWithDetails, PaginatedMessages, ProposalsResponse, HomeData, PlanData } from '@shared/types/api';

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
  /**
   * Fetches current topic data for the home page
   * @returns Promise resolving to home page data including current topic, proposal, and status
   * @throws {APIError} When the request fails or returns an error status
   */
  async getHome(): Promise<HomeData> {
    return fetchWithRetry<HomeData>(WEBSITE_API.topics.getCurrent(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * Fetches paginated messages for a specific topic
   * @param topicId - The ID of the topic to fetch messages for
   * @param limit - Maximum number of messages to return (default: 50)
   * @param offset - Number of messages to skip for pagination (default: 0)
   * @returns Promise resolving to paginated messages with total count and hasMore flag
   * @throws {APIError} When the request fails or returns an error status
   */
  async getMessages(topicId: string, limit: number = 50, offset: number = 0): Promise<PaginatedMessages> {
    return fetchWithRetry<PaginatedMessages>(WEBSITE_API.messages.getByTopic(topicId, limit, offset), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * Fetches business plan data for a specific topic
   * @param topicId - The ID of the topic to fetch plan data for
   * @returns Promise resolving to plan data including plan content, topic info, and structured steps
   * @throws {APIError} When the request fails or returns an error status
   */
  async getPlan(topicId: string): Promise<PlanData> {
    return fetchWithRetry<PlanData>(WEBSITE_API.topics.getById(topicId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * Fetches all proposals with optional status filter
   * @param status - Optional status filter ('queued', 'in_debate', 'adopted', 'rejected')
   * @returns Promise resolving to proposals list with count
   * @throws {APIError} When the request fails or returns an error status
   */
  async getProposals(status?: string): Promise<ProposalsResponse> {
    return fetchWithRetry<ProposalsResponse>(WEBSITE_API.proposals.getAll(status), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  logError
};

export { APIError };
