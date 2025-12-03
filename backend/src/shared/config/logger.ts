/**
 * Simple logger utility for structured logging
 * In production, consider using a proper logging library like Winston or Pino
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

/**
 * Formats log entry as JSON string
 */
function formatLog(level: LogLevel, message: string, data?: unknown): string {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(data ? { data } : {}),
  };
  return JSON.stringify(entry);
}

/**
 * Logger utility with different log levels
 */
export const logger = {
  /**
   * Log info message
   */
  info: (message: string, data?: unknown): void => {
    console.log(formatLog('info', message, data));
  },

  /**
   * Log warning message
   */
  warn: (message: string, data?: unknown): void => {
    console.warn(formatLog('warn', message, data));
  },

  /**
   * Log error message
   */
  error: (message: string, data?: unknown): void => {
    console.error(formatLog('error', message, data));
  },

  /**
   * Log debug message (only in development)
   */
  debug: (message: string, data?: unknown): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog('debug', message, data));
    }
  },
};

