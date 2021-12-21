import { appendFile } from 'fs';
import { join as pathJoin } from 'path';
import { INFO } from '../levels';
import { FileBufferStreamOption, Stream, Fields } from '../types';

const defaultOption: FileBufferStreamOption = {
  dir: '/tmp',
  flushInterval: 1000,
  maxBufferLength: 1000,
  level: INFO,
};

export default class FileBufferStream implements Stream {
  private _options: FileBufferStreamOption;
  private _bufSize: number = 0;
  private _buf: any[] = [];
  private _timer: NodeJS.Timeout;

  constructor(options?: FileBufferStreamOption) {
    this._options = Object.assign({}, defaultOption, options);
    this._timer = this._createInterval();
  }

  /**
   * create interval to flush log into file
   */
  private _createInterval() {
    return setInterval(() => this.flush(), this._options.flushInterval);
  }

  /**
   * close interval
   */
  private _closeInterval() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  appendFile(data: string) {
    if (data.length === 0) return;
    const now = new Date();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const ymd = `${now.getFullYear()}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
    const filename = pathJoin(this._options.dir, `app.${ymd}.log`);
    appendFile(filename, data + '\n', 'utf-8', err => {
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

  write(rec: Fields) {
    const data = JSON.stringify(rec);
    this._buf.push(data);
    this._bufSize += data.length;
    if (this._bufSize >= this._options.maxBufferLength) {
      this.flush();
    }
  }
}
