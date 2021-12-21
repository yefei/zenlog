import { inspect } from 'util';
import { DEBUG, ERROR, INFO, LEVEL_NAMES, WARN } from '../levels';
import { Stream, Fields } from '../types';

/**
 * 取出指定属性值并删除属性
 */
function pop(obj: Fields, field: string) {
  const value = obj[field];
  delete obj[field];
  return value;
}

export default class ConsoleStream implements Stream {
  close(): void {}

  write(fields: Fields) {
    fields = Object.assign({}, fields);

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

    const tags = [];
    if (fields.time) {
      tags.push(new Date(pop(fields, 'time')).toLocaleString());
    }

    if (fields.level !== undefined) {
      tags.push(LEVEL_NAMES[pop(fields, 'level')]);
    }

    // name@hostname
    if (fields.hostname) {
      let hostname = pop(fields, 'hostname');
      if (fields.name) {
        hostname = pop(fields, 'name') + '@' + hostname;
      }
      tags.push(hostname);
    }
    else if (fields.name) {
      tags.push(pop(fields, 'name'));
    }

    // http req
    const req = [];
    for (const key of ['ip', 'method', 'host', 'url']) {
      if (fields[key]) {
        req.push(pop(fields, key));
      }
    }
    if (req.length) {
      tags.push(req.join(' '));
    }

    log('[' + tags.join('] [') + ']', pop(fields, 'msg'));

    // other fields
    for (const [key, value] of Object.entries(fields)) {
      log('%s:', key, inspect(value, {
        colors: process.env.NODE_ENV !== 'production',
      }));
    }
  }
}
