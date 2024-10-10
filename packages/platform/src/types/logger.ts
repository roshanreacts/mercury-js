export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type ILoggerConfig = {
  name: string;
  namespace: string[];
  level: LogLevel[];
  enabled?: boolean;
};
export interface ILogger {
  getSubLogger: (name: string) => ILogger;
  debug: (message: unknown) => void;
  info: (message: unknown) => void;
  warn: (message: unknown) => void;
  error: (message: unknown) => void;
}
