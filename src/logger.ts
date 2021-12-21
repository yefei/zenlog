import { format } from 'util';
import { LevelType } from '.';
import { DEBUG, ERROR, FATAL, INFO, TRACE, WARN } from './levels';
import { Fields, Serializer, Stream } from './types';

export default class Logger {
  private _fields: Fields;
  private _parent: Logger;
  private _serializers: Serializer[] = [];
  private _streams: Stream[] = [];

  constructor(fields: Fields, parent?: Logger) {
    this._fields = fields;
    this._parent = parent;
  }

  addSerializer(serializer: Serializer) {
    this._serializers.push(serializer);
    return this;
  }

  addStream(stream: Stream) {
    this._streams.push(stream);
    return this;
  }

  record(fields: Fields): void {
    const out = Object.assign({}, this._fields, fields);

    // 自定义序列化
    if (this._serializers.length > 0) {
      for (const [key, value] of Object.entries(out)) {
        for (const serializer of this._serializers) {
          if (serializer.is(key, value)) {
            delete out[key];
            Object.assign(out, serializer.serialize(key, value));
            break;
          }
        }
      }
    }

    if (this._parent) {
      return this._parent.record(out);
    }

    // 推送到流中
    for (const stream of this._streams) {
      stream.write(out);
    }
  }

  log(level: LevelType, ...msg: any[]) {
    this.record({ level, msg: format(...msg) });
    return this;
  }

  trace(...msg: any[]) {
    return this.log(TRACE, ...msg);
  }

  debug(...msg: any[]) {
    return this.log(DEBUG, ...msg);
  }

  info(...msg: any[]) {
    return this.log(INFO, ...msg);
  }

  warn(...msg: any[]) {
    return this.log(WARN, ...msg);
  }

  error(...msg: any[]) {
    return this.log(ERROR, ...msg);
  }

  fatal(...msg: any[]) {
    return this.log(FATAL, ...msg);
  }

  child(fields: Fields) {
    return new Logger(fields, this);
  }

  close() {
    for (const stream of this._streams) {
      stream.close();
    }
  }
}
