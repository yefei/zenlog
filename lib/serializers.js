'use strict';

class Serializer {
  is(key, value) {
    return false;
  }

  serialize(key, value) { }
}

class ErrorSerializer extends Serializer {
  is(key, value) {
    return value instanceof Error;
  }

  serialize(key, value) {
    return { [key]: {
      name: value.name,
      message: value.message,
      stack: value.stack.split('\n    at ').slice(1),
    } };
  }
}

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

module.exports = {
  Serializer,
  ErrorSerializer,
  TimeSerializer,
};
