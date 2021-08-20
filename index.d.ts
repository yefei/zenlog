
export interface Serializer {
  is(key: string, value: any): boolean;
  serialize(key: string, value: any): { [key: string]: any };
}

export interface ErrorSerializer extends Serializer {}
export interface TimeSerializer extends Serializer {}

export interface Stream {
  write(fields: { [key: string]: any }): void;
  close(): void;
}

export interface ConsoleStream extends Stream {}
export interface FileBufferStream extends Stream {}

export const TRACE: number;
export const DEBUG: number;
export const INFO: number;
export const WARN: number;
export const ERROR: number;
export const FATAL: number;

export declare class Logger {
  constructor(fields: { [key: string]: any });
  child(fields: { [key: string]: any }): Logger;
  addSerializer(serializer: Serializer): Logger;
  addStream(stream: Stream): Logger;
  close(): void;
  record(fields: { [key: string]: any }): void;
  log(level: number, ...msg: any): Logger;
  trace(level: number, ...msg: any): Logger;
  debug(level: number, ...msg: any): Logger;
  info(level: number, ...msg: any): Logger;
  warn(level: number, ...msg: any): Logger;
  error(level: number, ...msg: any): Logger;
  fatal(level: number, ...msg: any): Logger;
}
