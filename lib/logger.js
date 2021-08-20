'use strict';

const util = require('util');
const { Serializer } = require('./serializers');
const { Stream } = require('./streams');
const { LEVELS } = require('./levels');

class Logger {
  constructor(fields, parent) {
    this._fields = fields;
    this._parent = parent;
    this._serializers = [];
    this._streams = [];
  }

  /**
   * @param {Serializer} serializer 
   * @returns {Logger}
   */
  addSerializer(serializer) {
    if (serializer instanceof Serializer) {
      this._serializers.push(serializer);
    } else {
      throw new Error(`${serializer} not instanceof Serializer`);
    }
    return this;
  }

  /**
   * @param {Stream} stream 
   * @returns {Logger}
   */
  addStream(stream) {
    if (stream instanceof Stream) {
      this._streams.push(stream);
    } else {
      throw new Error(`${stream} not instanceof Stream`);
    }
    return this;
  }

  record(fields) {
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

  /**
   * @param {number} level 
   * @param  {...any} msg 
   * @returns {Logger}
   */
  log(level, ...msg) {
    this.record({ level, msg: util.format(...msg) });
    return this;
  }

  /**
   * @param {*} fields 
   * @returns {Logger}
   */
  child(fields) {
    return new Logger(fields, this);
  }

  close() {
    for (const stream of this._streams) {
      stream.close();
    }
  }
}

for (const [name, level] of Object.entries(LEVELS)) {
  Logger.prototype[name] = function (...msg) {
    return this.log(level, ...msg);
  };
}

module.exports = Logger;
