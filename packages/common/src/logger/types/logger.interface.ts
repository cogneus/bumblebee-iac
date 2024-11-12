import { BaseLoggerInterface, LogMethodInput } from './base-logger.interface'
import { LoggerConfig } from './logger-config.interface'

/**
 * logger implementation implements typical params for severity logging functions
 */
export interface Logger extends BaseLoggerInterface {
  trace(...args: LogMethodInput): void
  debug(...args: LogMethodInput): void
  info(...args: LogMethodInput): void
  warn(...args: LogMethodInput): void
  error(...args: LogMethodInput): void
  /**
   * Method creating a new instance of logger that logs everything parent's scope contain
   * plus data passed with input scope. e.g { requestId } from parent and { user } from input scope
   * will cause having { requestId, user } in metadata of any scoped logger message
   * @param {object} scope - any data what provides additional context. Similar to @see LogMethodInput.metadata, but permanent.
   * @param {LoggerConfig} config - optional log config overrides
   */
  getScopedLogger(scope: Record<string, any>, config?: Partial<LoggerConfig>): Logger
}
