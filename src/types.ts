export type LevelType = number;

export type SerializeResult = { [key: string]: any };

export interface Serializer {
  /**
   * 判断key或value是否支持序列化
   */
  is(key: string, value: any): boolean;

  /**
   * 执行序列化操作
   */
  serialize(key: string, value: any): SerializeResult;
}

export interface Fields {
  level?: LevelType;
  time?: any;
  hostname?: string;
  msg?: string;
  [key: string]: any;
}

export interface Stream {
  /**
   * 写入数据
   * @param fields
   */
  write(fields: Fields): void;

  /**
   * 关闭流
   */
  close(): void;
}

export interface FileBufferStreamOption {
  /**
   * 存储目录
   */
  dir: string;

  /**
   * 数据落盘间隔
   */
  flushInterval: number;

  /**
   * 最大缓冲长度
   */
  maxBufferLength: number;

  /**
   * 记录级别
   */
  level: LevelType;
}
