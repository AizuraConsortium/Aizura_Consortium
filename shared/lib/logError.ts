import { apiClient } from './apiClient';

export async function logError(
  source: string,
  errorType: string,
  message: string,
  details?: any
): Promise<void> {
  try {
    await fetch(`${apiClient.API_URL}/errors/log`, {
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
