'use strict';

const { Serializer } = require('..');

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

module.exports = ErrorSerializer;
