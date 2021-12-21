import { hostname } from 'os';
import { INFO } from './levels';
import Logger from './logger';
import ErrorSerializer from './serializers/error';
import TimeSerializer from './serializers/time';
import ConsoleStream from './streams/console';
import { Fields } from './types';
export { default as FileBufferStream } from './streams/file_buffer';
export { default as Logger } from './logger';
export * from './types';
export * from './levels';

const defaultFields: Fields = {
  level: INFO,
  time: TimeSerializer.TIMESTAMP,
  hostname: hostname(),
};

export function createLogger(fields: Fields): Logger {
  const logger = new Logger(Object.assign({}, defaultFields, fields));
  logger.addSerializer(new ErrorSerializer());
  logger.addSerializer(new TimeSerializer());
  logger.addStream(new ConsoleStream());
  return logger;
}
