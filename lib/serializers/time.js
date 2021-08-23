'use strict';

const { Serializer } = require('..');

class TimeSerializer extends Serializer {
  is(key, value) {
    return value === TimeSerializer.DATETIME || value === TimeSerializer.TIMESTAMP;
  }

  serialize(key, value) {
    if (value === TimeSerializer.DATETIME) {
      value = new Date();
    }
    if (value === TimeSerializer.TIMESTAMP) {
      value = Date.now();
    }
    return { [key]: value };
  }
}

TimeSerializer.DATETIME = Symbol('TimeSerializer#datetime');
TimeSerializer.TIMESTAMP = Symbol('TimeSerializer#timestamp');

module.exports = TimeSerializer;
