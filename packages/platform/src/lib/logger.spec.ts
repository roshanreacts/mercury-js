import { Logger } from './logger';

describe('logger', () => {
  it('should be able to log specific level of log', () => {
    const logger = new Logger({
      name: 'test',
      namespace: ['test'],
      level: ['debug', 'info', 'warn', 'error'],
    });
    logger.debug('debug');
  });

  it('should not be able to log', () => {
    const logger = new Logger({
      name: 'test',
      namespace: ['test'],
      level: ['info', 'warn', 'error'],
    });
    logger.debug('debug');
  });
  it('should not be able to log without namespace', () => {
    const logger = new Logger({
      name: 'test',
      namespace: [],
      level: ['debug', 'info', 'warn', 'error'],
    });
    logger.debug('debug');
  });
  it('should get sublogger', () => {
    const logger = new Logger({
      name: 'test',
      namespace: ['test:sub'],
      level: ['debug', 'info', 'warn', 'error'],
    });
    const subLogger = logger.getSubLogger('sub');
    logger.debug('2');
    subLogger.debug('debug');
  });
});
