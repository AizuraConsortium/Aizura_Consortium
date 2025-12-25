import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@shared/types/profile';

interface ApiClient {
  get<T>(endpoint: string, token?: string): Promise<T>;
}

interface UseUserProfileOptions {
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: UserProfile) => void;
}

interface UseUserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(
  apiClient: ApiClient,
  token?: string,
  options: UseUserProfileOptions = {}
): UseUserProfileResult {
  const { skip = false, onError, onSuccess } = options;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (skip || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get<UserProfile>('/client/profile', token);
      setProfile(data);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);

      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [apiClient, token, skip, onError, onSuccess]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}
