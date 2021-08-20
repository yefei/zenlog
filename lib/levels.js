'use strict';

const TRACE = 10;
const DEBUG = 20;
const INFO = 30;
const WARN = 40;
const ERROR = 50;
const FATAL = 60;

const LEVELS = {
  trace: TRACE,
  debug: DEBUG,
  info: INFO,
  warn: WARN,
  error: ERROR,
  fatal: FATAL,
};

const LEVELS_NAME = {};
for (const [key, value] of Object.entries(LEVELS)) {
  LEVELS_NAME[value] = key.toUpperCase();
}

module.exports = {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
  LEVELS,
  LEVELS_NAME,
};
