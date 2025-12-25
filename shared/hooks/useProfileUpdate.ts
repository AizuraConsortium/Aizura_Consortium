import { useState, useCallback } from 'react';
import type { UpdateProfileData, UserProfile } from '@shared/types/profile';

interface ApiClient {
  put<T>(endpoint: string, data: unknown, token?: string): Promise<T>;
}

interface UseProfileUpdateOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: UserProfile) => void;
}

interface UseProfileUpdateResult {
  updateProfile: (data: UpdateProfileData) => Promise<UserProfile>;
  loading: boolean;
  error: string | null;
}

export function useProfileUpdate(
  apiClient: ApiClient,
  token?: string,
  options: UseProfileUpdateOptions = {}
): UseProfileUpdateResult {
  const { onError, onSuccess } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<UserProfile> => {
      if (!token) {
        throw new Error('Authentication token required');
      }

      try {
        setLoading(true);
        setError(null);

        const result = await apiClient.put<UserProfile>('/client/profile', data, token);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
        setError(errorMessage);

        if (onError && err instanceof Error) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiClient, token, onError, onSuccess]
  );

  return {
    updateProfile,
    loading,
    error,
  };
}
