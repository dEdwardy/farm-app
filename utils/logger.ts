// 日志工具 - 根据环境变量控制日志输出
// 开发环境输出所有级别日志，生产环境只输出错误级别

// 判断是否为开发环境
const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

// 日志级别枚举
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// 格式化日志前缀，包含时间戳、级别和标签
const formatPrefix = (level: LogLevel, tag?: string): string => {
  const timestamp = new Date().toISOString();
  return tag ? `[${timestamp}] [${level}] [${tag}]` : `[${timestamp}] [${level}]`;
};

// 根据日志级别输出到对应的console方法
const logToConsole = (level: LogLevel, prefix: string, ...args: unknown[]): void => {
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(prefix, ...args);
      break;
    case LogLevel.INFO:
      console.log(prefix, ...args);
      break;
    case LogLevel.WARN:
      console.warn(prefix, ...args);
      break;
    case LogLevel.ERROR:
      console.error(prefix, ...args);
      break;
  }
};

// 判断是否应该输出日志（开发环境或错误级别）
const shouldLog = (level: LogLevel): boolean => {
  return isDevelopment || level === LogLevel.ERROR;
};

// 核心日志函数
const coreLog = (level: LogLevel, tag: string | undefined, ...args: unknown[]): void => {
  if (!shouldLog(level)) return;
  
  const prefix = formatPrefix(level, tag);
  logToConsole(level, prefix, ...args);
};

// 导出统一的日志工具对象
export const logger = {
  debug: (tag: string, ...args: unknown[]) => coreLog(LogLevel.DEBUG, tag, ...args),
  info: (tag: string, ...args: unknown[]) => coreLog(LogLevel.INFO, tag, ...args),
  warn: (tag: string, ...args: unknown[]) => coreLog(LogLevel.WARN, tag, ...args),
  error: (tag: string, ...args: unknown[]) => coreLog(LogLevel.ERROR, tag, ...args),
};

// 兼容旧的console.log方式（可选）
export const log = logger.info;
export const logError = logger.error;
export const logWarn = logger.warn;
export const logDebug = logger.debug;
