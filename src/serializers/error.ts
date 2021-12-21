import { Serializer } from "../types";

export default class ErrorSerializer implements Serializer {
  is(key: string, value: any) {
    return value instanceof Error;
  }

  serialize(key: string, value: any) {
    return { [key]: {
      name: value.name,
      message: value.message,
      stack: value.stack.split('\n    at ').slice(1),
    } };
  }
}
