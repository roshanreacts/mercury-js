import { ILogger, ILoggerConfig } from '../types';

export class Logger implements ILogger {
  private config: ILoggerConfig;
  constructor(config: ILoggerConfig) {
    this.config = config;
  }
  getSubLogger(name: string) {
    return new Logger({
      name: `${this.config.name}:${name}`,
      namespace: this.config.namespace,
      level: this.config.level,
    });
  }
  debug(message: unknown) {
    if (
      this.config.level.includes('debug') &&
      this.config.namespace.includes(this.config.name)
    ) {
      console.log(
        `${this.config.name}    DEBUG   `,
        JSON.stringify(message, null, 2)
      );
    }
  }
  info(message: unknown) {
    if (
      this.config.level.includes('info') &&
      this.config.namespace.includes(this.config.name)
    ) {
      console.log(
        `${this.config.name}    INFO    `,
        JSON.stringify(message, null, 2)
      );
    }
  }
  warn(message: unknown) {
    if (
      this.config.level.includes('warn') &&
      this.config.namespace.includes(this.config.name)
    ) {
      console.log(
        `${this.config.name}    WARN    `,
        JSON.stringify(message, null, 2)
      );
    }
  }
  error(message: unknown) {
    if (
      this.config.level.includes('error') &&
      this.config.namespace.includes(this.config.name)
    ) {
      console.log(
        `${this.config.name}    ERROR   `,
        JSON.stringify(message, null, 2)
      );
    }
  }
}
