import { Serializer } from "../types";

export default class TimeSerializer implements Serializer {
  static DATETIME = Symbol('TimeSerializer#datetime');
  static TIMESTAMP = Symbol('TimeSerializer#timestamp');

  is(key: string, value: any) {
    return value === TimeSerializer.DATETIME || value === TimeSerializer.TIMESTAMP;
  }

  serialize(key: string, value: any) {
    if (value === TimeSerializer.DATETIME) {
      value = new Date();
    }
    if (value === TimeSerializer.TIMESTAMP) {
      value = Date.now();
    }
    return { [key]: value };
  }
}
