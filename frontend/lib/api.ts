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

export const api = {
  async getHome() {
    return fetchWithRetry(`${API_URL}/home`);
  },

  async getMessages(topicId: string, limit: number = 50, offset: number = 0) {
    return fetchWithRetry(`${API_URL}/room/${topicId}/messages?limit=${limit}&offset=${offset}`);
  },

  async getPlan(topicId: string) {
    return fetchWithRetry(`${API_URL}/plan/${topicId}`);
  },

  async getProposals() {
    return fetchWithRetry(`${API_URL}/proposals`);
  },

  async createProposal(title: string, summary: string, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetchWithRetry(`${API_URL}/proposals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, summary })
    });
  },

  async voteOnProposal(proposalId: string, vote: 'for' | 'against', token: string) {
    return fetchWithRetry(`${API_URL}/proposals/${proposalId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ vote })
    });
  },

  async getErrors(queryString?: string) {
    const url = queryString ? `${API_URL}/errors?${queryString}` : `${API_URL}/errors`;
    return fetchWithRetry(url);
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
