import { apiClient, APIError, logError } from '@shared/lib';

export const api = {
  ...apiClient,
  logError
};

export { APIError };
