import { LevelType } from './types';

export const TRACE: LevelType = 10;
export const DEBUG: LevelType = 20;
export const INFO: LevelType = 30;
export const WARN: LevelType = 40;
export const ERROR: LevelType = 50;
export const FATAL: LevelType = 60;

export const LEVELS = {
  trace: TRACE,
  debug: DEBUG,
  info: INFO,
  warn: WARN,
  error: ERROR,
  fatal: FATAL,
};

export const LEVEL_NAMES: { [level: LevelType]: string } = {};

for (const [key, value] of Object.entries(LEVELS)) {
  LEVEL_NAMES[value] = key.toUpperCase();
}
