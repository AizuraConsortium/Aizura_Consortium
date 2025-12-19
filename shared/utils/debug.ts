type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface DebugConfig {
  enabled: boolean;
  level: LogLevel;
  categories: Set<string>;
}

const isDevelopment = (() => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }
  return false;
})();

const config: DebugConfig = {
  enabled: isDevelopment,
  level: 'debug',
  categories: new Set(),
};

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function enableDebug(categories?: string[]) {
  config.enabled = true;
  if (categories) {
    categories.forEach((cat) => config.categories.add(cat));
  }
}

export function disableDebug() {
  config.enabled = false;
}

export function setDebugLevel(level: LogLevel) {
  config.level = level;
}

function shouldLog(category: string, level: LogLevel): boolean {
  if (!config.enabled) return false;
  if (config.categories.size > 0 && !config.categories.has(category)) return false;
  return levelPriority[level] >= levelPriority[config.level];
}

export function debugLog(category: string, message: string, data?: any) {
  if (!shouldLog(category, 'debug')) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${category}]`;

  console.log(
    `%c${prefix}%c ${message}`,
    'color: #3b82f6; font-weight: bold',
    'color: inherit',
    data !== undefined ? data : ''
  );
}

export function debugInfo(category: string, message: string, data?: any) {
  if (!shouldLog(category, 'info')) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${category}]`;

  console.info(
    `%c${prefix}%c ${message}`,
    'color: #10b981; font-weight: bold',
    'color: inherit',
    data !== undefined ? data : ''
  );
}

export function debugWarn(category: string, message: string, data?: any) {
  if (!shouldLog(category, 'warn')) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${category}]`;

  console.warn(
    `%c${prefix}%c ${message}`,
    'color: #f59e0b; font-weight: bold',
    'color: inherit',
    data !== undefined ? data : ''
  );
}

export function debugError(category: string, message: string, error?: any) {
  if (!shouldLog(category, 'error')) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${category}]`;

  console.error(
    `%c${prefix}%c ${message}`,
    'color: #ef4444; font-weight: bold',
    'color: inherit',
    error !== undefined ? error : ''
  );
}

export function debugGroup(category: string, title: string, fn: () => void) {
  if (!config.enabled) {
    fn();
    return;
  }

  console.group(`[${category}] ${title}`);
  fn();
  console.groupEnd();
}

export function debugTable(category: string, data: any[]) {
  if (!shouldLog(category, 'debug')) return;
  console.table(data);
}

export function debugTime(category: string, label: string) {
  if (!config.enabled) return;
  console.time(`[${category}] ${label}`);
}

export function debugTimeEnd(category: string, label: string) {
  if (!config.enabled) return;
  console.timeEnd(`[${category}] ${label}`);
}

export const debug = {
  log: debugLog,
  info: debugInfo,
  warn: debugWarn,
  error: debugError,
  group: debugGroup,
  table: debugTable,
  time: debugTime,
  timeEnd: debugTimeEnd,
  enable: enableDebug,
  disable: disableDebug,
  setLevel: setDebugLevel,
};
