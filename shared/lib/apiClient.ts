function resolveApiUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredUrl) {
    return 'http://localhost:3001/api';
  }

  const normalizedUrl = configuredUrl.replace(/\/+$/, '');
  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
}

const API_URL = resolveApiUrl();

function resolveEndpoint(endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return normalizedEndpoint.startsWith('/api/')
    ? normalizedEndpoint.slice(4)
    : normalizedEndpoint;
}

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    'VITE_API_URL environment variable is not set. Using default: http://localhost:3001/api\n' +
    'Set VITE_API_URL in your .env file for production deployments.'
  );
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText };
    }

    const errorMessage = typeof errorData === 'object' && errorData !== null && 'error' in errorData
      ? String(errorData.error)
      : `HTTP ${response.status}: ${response.statusText}`;

    throw new APIError(
      errorMessage,
      response.status,
      response.statusText,
      errorData
    );
  }

  return response.json();
}

function validateResponse<T>(
  data: unknown,
  validator?: (val: unknown) => val is T
): T {
  if (validator && !validator(data)) {
    console.error('API response validation failed:', data);
    throw new Error('API response does not match expected type');
  }
  return data as T;
}

async function fetchWithRetry(url: string, options?: RequestInit, retries = 2): Promise<unknown> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

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

function createHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const apiClient = {
  get API_URL() {
    return API_URL;
  },

  async get<T>(endpoint: string, token?: string, validator?: (val: unknown) => val is T): Promise<T> {
    const data = await fetchWithRetry(`${API_URL}${resolveEndpoint(endpoint)}`, {
      method: 'GET',
      headers: createHeaders(token)
    });
    return validateResponse(data, validator);
  },

  async post<T>(endpoint: string, body?: unknown, token?: string, validator?: (val: unknown) => val is T): Promise<T> {
    const data = await fetchWithRetry(`${API_URL}${resolveEndpoint(endpoint)}`, {
      method: 'POST',
      headers: createHeaders(token),
      body: body ? JSON.stringify(body) : undefined
    });
    return validateResponse(data, validator);
  },

  async delete<T>(endpoint: string, token?: string, validator?: (val: unknown) => val is T): Promise<T> {
    const data = await fetchWithRetry(`${API_URL}${resolveEndpoint(endpoint)}`, {
      method: 'DELETE',
      headers: createHeaders(token)
    });
    return validateResponse(data, validator);
  }
};
