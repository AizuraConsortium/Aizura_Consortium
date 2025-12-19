const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    'VITE_API_URL environment variable is not set. Using default: http://localhost:3001/api\n' +
    'Set VITE_API_URL in your .env file for production deployments.'
  );
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse(response: Response) {
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

async function fetchWithRetry(url: string, options?: RequestInit, retries = 2): Promise<any> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Don't retry on last attempt
      if (i === retries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
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

export const api = {
  async get<T = any>(endpoint: string, token?: string): Promise<T> {
    return fetchWithRetry(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: createHeaders(token)
    });
  },

  async post<T = any>(endpoint: string, body?: any, token?: string): Promise<T> {
    return fetchWithRetry(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(token),
      body: body ? JSON.stringify(body) : undefined
    });
  },

  async delete<T = any>(endpoint: string, token?: string): Promise<T> {
    return fetchWithRetry(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(token)
    });
  },

  async getHome() {
    return this.get('/home');
  },

  async getMessages(topicId: string, limit: number = 50, offset: number = 0) {
    return this.get(`/room/${topicId}/messages?limit=${limit}&offset=${offset}`);
  },

  async getPlan(topicId: string) {
    return this.get(`/plan/${topicId}`);
  },

  async getProposals() {
    return this.get('/proposals');
  },

  async createProposal(title: string, summary: string, token?: string) {
    return this.post('/proposals', { title, summary }, token);
  },

  async voteOnProposal(proposalId: string, vote: 'for' | 'against', token: string) {
    return this.post(`/proposals/${proposalId}/vote`, { vote }, token);
  },

  async getErrors(queryString?: string) {
    const endpoint = queryString ? `/errors?${queryString}` : '/errors';
    return this.get(endpoint);
  },

  async logError(source: string, errorType: string, message: string, details?: any) {
    try {
      await fetch(`${API_URL}/errors/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source,
          severity: 'error',
          errorType,
          message,
          details
        })
      });
    } catch (error) {
      console.error('Failed to log error to backend:', error);
    }
  }
};

export { APIError };
