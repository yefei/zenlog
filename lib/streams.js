'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { DEBUG, INFO, WARN, ERROR, LEVELS_NAME } = require('./levels');

class Stream {
  write(fields) {}
  close() {}
}

class ConsoleStream extends Stream {
  write(fields) {
    let log;
    if (fields.level < DEBUG) {
      log = console.trace;
    } else if (fields.level < INFO) {
      log = console.debug;
    } else if (fields.level < WARN) {
      log = console.info;
    } else if (fields.level < ERROR) {
      log = console.warn;
    } else {
      log = console.error;
    }
    const line1 = [];
    if (fields.time) {
      line1.push('[' + new Date(fields.time).toLocaleString() + ']');
    }
    line1.push('[' + LEVELS_NAME[fields.level] + ']');
    if (fields.hostname) {
      line1.push('[' + fields.hostname + ']');
    }
    line1.push(fields.msg);
    log(line1.join(' '));

    for (const key of Object.keys(fields).filter(k => ['time', 'level', 'hostname', 'msg'].indexOf(k) === -1)) {
      log('%s:', key, util.inspect(fields[key], { colors: true }));
    }
  }
}

class FileBufferStream extends Stream {
  /**
   * @param {object} options
   * @param {string} options.dir - log file dir
   * @param {number} [options.flushInterval = 1000] - interval for flush to file
   * @param {number} [options.maxBufferLength = 1000] - max buffer queue length
   * @param {string} [options.level = INFO] - log level
   */
  constructor(options) {
    super();
    assert.ok(options.dir, '"FileBufferStream" stream should not give a "dir"');
    this._options = Object.assign({
      flushInterval: 1000,
      maxBufferLength: 1000,
    }, options);
    this._bufSize = 0;
    this._buf = [];
    this._timer = this._createInterval();
  }

  /**
   * create interval to flush log into file
   * @return {Interval}
   * @private
   */
  _createInterval() {
    return setInterval(() => this.flush(), this._options.flushInterval);
  }

  /**
   * close interval
   * @private
   */
  _closeInterval() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  /**
   * @param {string} data
   */
  appendFile(data) {
    if (data.length === 0) return;
    const now = new Date();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const ymd = `${now.getFullYear()}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
    const filename = path.join(this._options.dir, `app.${ymd}.log`);
    fs.appendFile(filename, data + '\n', 'utf-8', err => {
      if (err) {
        console.error('zenlog append file error: %s', err.message);
      }
    });
  }

  /**
   * flush log into file
   */
  flush() {
    if (this._buf.length > 0) {
      this.appendFile(this._buf.join('\n'));
      this._buf = [];
      this._bufSize = 0;
    }
  }

  close() {
    this.flush();
    this._closeInterval();
  }

  write(rec) {
    const data = JSON.stringify(rec);
    this._buf.push(data);
    this._bufSize += data.length;
    if (this._bufSize >= this._options.maxBufferLength) {
      this.flush();
    }
  }
}

module.exports = {
  Stream,
  ConsoleStream,
  FileBufferStream,
};
