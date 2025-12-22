export interface APICallLog {
  endpoint: string;
  method: string;
  timestamp: number;
  duration?: number;
  status?: number;
  error?: string;
}

class APILogger {
  private logs: APICallLog[] = [];
  private maxLogs = 100;

  log(entry: APICallLog) {
    if (import.meta.env.DEV) {
      console.debug('[API Call]', entry);
    }

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  getLogs(): APICallLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const apiLogger = new APILogger();
