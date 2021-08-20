'use strict';

const os = require('os');
const Logger = require('./lib/logger');
const {
  Serializer,
  ErrorSerializer,
  TimeSerializer,
} = require('./lib/serializers');
const {
  Stream,
  ConsoleStream,
  FileBufferStream,
} = require('./lib/streams');
const levels = require('./lib/levels');

/**
 * @param {{ [key: string]: any }} [fields]
 * @returns {Logger}
 */
function createLogger(fields) {
  const logger = new Logger(Object.assign({
    time: TimeSerializer.TIMESTAMP,
    hostname: os.hostname(),
  }, fields));
  logger.addSerializer(new ErrorSerializer());
  logger.addSerializer(new TimeSerializer());
  logger.addStream(new ConsoleStream());
  return logger;
}

module.exports = {
  createLogger,
  Logger,
  Serializer,
  ErrorSerializer,
  TimeSerializer,
  Stream,
  ConsoleStream,
  FileBufferStream,
  ...levels,
};
