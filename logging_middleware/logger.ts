export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'FATAL';

export interface LogContext {
  module?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

const COLORS = {
  RESET: '\x1b[0m',
  INFO: '\x1b[36m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m',
  DEBUG: '\x1b[90m',
  TIMESTAMP: '\x1b[32m',
};

export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWE0NzM1QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjM4ODM5LCJpYXQiOjE3ODA2Mzc5MzksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJkMmE3Mzg2ZS0wYzRmLTRiMzMtODFkYy1mNmZhNmJiNjk4ZDEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJwcmVtbmFyZW4iLCJzdWIiOiJmOTVmNGYwOC1kNGExLTQ5ODMtYjk0NS01ODI2Zjc3NmNlZjUifSwiZW1haWwiOiIyM2JxMWE0NzM1QHZ2aXQubmV0IiwibmFtZSI6InByZW1uYXJlbiIsInJvbGxObyI6IjIzYnExYTQ3MzUiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiJmOTVmNGYwOC1kNGExLTQ5ODMtYjk0NS01ODI2Zjc3NmNlZjUiLCJjbGllbnRTZWNyZXQiOiJxR1JXVERWQ2V3aHhoRFRRIn0.gzubesToKYs7s3IfPgQAF0PviInK6Amb5hGYlcrBxSQ";

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

function formatConsole(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const contextString = context && Object.keys(context).length > 0 
    ? ` | context: ${JSON.stringify(context)}` 
    : '';

  if (isBrowser()) {
    const colorMap = {
      INFO: 'color: #00bcd4; font-weight: bold',
      WARN: 'color: #ff9800; font-weight: bold',
      ERROR: 'color: #f44336; font-weight: bold',
      DEBUG: 'color: #9e9e9e; font-style: italic',
      FATAL: 'color: #d32f2f; font-weight: bold; background-color: #ffebee',
    };

    console.log(
      `%c[${timestamp}] [${level}] %c${message}%c${contextString}`,
      'color: #4caf50',
      colorMap[level as keyof typeof colorMap] || 'color: inherit',
      'color: inherit'
    );
  } else {
    const levelColor = COLORS[level as keyof typeof COLORS] || COLORS.RESET;
    console.log(
      `${COLORS.TIMESTAMP}[${timestamp}]${COLORS.RESET} ${levelColor}[${level}]${COLORS.RESET} ${message}${COLORS.DEBUG}${contextString}${COLORS.RESET}`
    );
  }
}

export async function Log(stack: string, level: string, packageField: string, message: string): Promise<any> {
  const allowedStacks = ["backend", "frontend"];
  const allowedLevels = ["debug", "info", "warn", "error", "fatal"];
  const allowedPackages = [
    "api", "component", "hook", "page", "state", "style", 
    "auth", "config", "middleware", "utils"
  ];

  if (!allowedStacks.includes(stack.toLowerCase())) return null;
  if (!allowedLevels.includes(level.toLowerCase())) return null;
  if (!allowedPackages.includes(packageField.toLowerCase())) return null;

  formatConsole(level.toUpperCase() as LogLevel, `[${packageField}] ${message}`);

  try {
    const response = await fetch("/api-gateway/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        packageField: packageField.toLowerCase(),
        message: message
      })
    });
    return await response.json();
  } catch (error) {
    return null;
  }
}

export const logger = {
  info(message: string, context?: LogContext): void {
    formatConsole('INFO', message, context);
    Log("frontend", "info", "utils", message);
  },
  warn(message: string, context?: LogContext): void {
    formatConsole('WARN', message, context);
    Log("frontend", "warn", "utils", message);
  },
  error(message: string, context?: LogContext): void {
    formatConsole('ERROR', message, context);
    Log("frontend", "error", "utils", message);
  },
  debug(message: string, context?: LogContext): void {
    formatConsole('DEBUG', message, context);
    Log("frontend", "debug", "utils", message);
  },
};