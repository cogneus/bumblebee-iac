import { EventData, LoggerConfig } from './types'
import { BaseConsoleLogger } from './base-console-logger'
import { jsonFormatter } from './formatters'
import { removeFields } from './processors'
import { Logger, LogMethodInput } from './types'

export class ConsoleLogger extends BaseConsoleLogger implements Logger {
  constructor(config: LoggerConfig, scope: Record<string, any> = {}) {
    const { levels, formatter, ignoreFields } = config
    super(
      {
        ...config,
        levels,
        formatter: formatter || jsonFormatter({ processor: removeFields({ ignoreFields }) }),
      },
      scope
    )
  }

  public trace(...args: LogMethodInput): void {
    this.writeLog('trace', ...this.normaliseArgs(args))
  }

  public debug(...args: LogMethodInput): void {
    this.writeLog('debug', ...this.normaliseArgs(args))
  }

  public info(...args: LogMethodInput): void {
    this.writeLog('info', ...this.normaliseArgs(args))
  }

  public warn(...args: LogMethodInput): void {
    this.writeLog('warn', ...this.normaliseArgs(args))
  }

  public error(...args: LogMethodInput): void {
    this.writeLog('error', ...this.normaliseArgs(args))
  }

  public getScopedLogger(scope: Record<string, any>, config?: Partial<LoggerConfig>): Logger {
    return new ConsoleLogger(...this.getScopedLoggerConfig(scope, config))
  }

  private normaliseArgs([messageOrData, eventDataOrNull]: [string | EventData, EventData?]): [
    string | undefined,
    string,
    Record<string, any>?,
  ] {
    const msg: string = typeof messageOrData === 'string' ? messageOrData : ''
    const data: EventData | undefined =
      typeof messageOrData === 'object' ? messageOrData : eventDataOrNull

    if (data) {
      const { eventCode, message, ...eventData } = data
      return [eventCode || this.defaultEventCode, msg || message || '', eventData]
    }
    return [this.defaultEventCode, msg]
  }
}
