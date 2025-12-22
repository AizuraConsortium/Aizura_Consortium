import { apiClient, APIError, logError } from '@shared/lib';
import type { TopicWithDetails, PaginatedMessages, ProposalsResponse, HomeData, PlanData } from '@shared/types/api';

export const api = {
  ...apiClient,

  /**
   * Fetches current topic data for the home page
   * @returns Promise resolving to home page data including current topic, proposal, and status
   * @throws {APIError} When the request fails or returns an error status
   */
  async getHome(): Promise<HomeData> {
    return apiClient.get<HomeData>('/website/topics/current');
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
    return apiClient.get<PaginatedMessages>(`/website/messages/topic/${topicId}?limit=${limit}&offset=${offset}`);
  },

  /**
   * Fetches business plan data for a specific topic
   * @param topicId - The ID of the topic to fetch plan data for
   * @returns Promise resolving to plan data including plan content, topic info, and structured steps
   * @throws {APIError} When the request fails or returns an error status
   */
  async getPlan(topicId: string): Promise<PlanData> {
    return apiClient.get<PlanData>(`/website/topics/${topicId}`);
  },

  /**
   * Fetches all proposals with optional status filter
   * @param status - Optional status filter ('queued', 'in_debate', 'adopted', 'rejected')
   * @returns Promise resolving to proposals list with count
   * @throws {APIError} When the request fails or returns an error status
   */
  async getProposals(status?: string): Promise<ProposalsResponse> {
    const endpoint = status ? `/website/proposals?status=${status}` : '/website/proposals';
    return apiClient.get<ProposalsResponse>(endpoint);
  },

  logError
};

export { APIError };
