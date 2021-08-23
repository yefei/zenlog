'use strict';

const os = require('os');
const { Logger, Stream, Serializer } = require('./lib');
const ErrorSerializer = require('./lib/serializers/error');
const TimeSerializer = require('./lib/serializers/time');
const ConsoleStream = require('./lib/streams/console');
const FileBufferStream = require('./lib/streams/file_buffer');
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
