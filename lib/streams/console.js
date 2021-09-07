'use strict';

const util = require('util');
const { Stream } = require('..');
const { DEBUG, INFO, WARN, ERROR, LEVELS_NAME } = require('../levels');

function pop(obj, field) {
  const value = obj[field];
  delete obj[field];
  return value;
}

class ConsoleStream extends Stream {
  write(fields) {
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
      tags.push(LEVELS_NAME[pop(fields, 'level')]);
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
      log('%s:', key, util.inspect(value, {
        colors: process.env.NODE_ENV !== 'production',
      }));
    }
  }
}

module.exports = ConsoleStream;
