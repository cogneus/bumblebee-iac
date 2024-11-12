import pick from 'lodash.pick'
import {
  LogMethodInput,
  LogLevel,
  LogLevels,
  BaseLoggerInterface,
  WriteMethodInput,
  LevelResolver,
  LoggerConfig,
  Transformer,
  Formatter,
} from './types'
import { getInheritedProperties, inheritObjects, print, getSrcInfo, getLevelNumber } from './utils'
import { defaultLevels } from './consts'
import { jsonFormatter } from './formatters'

const defaultResolver = () => 'debug'

export class BaseConsoleLogger<EventT = string> implements BaseLoggerInterface {
  protected readonly minLevel: number
  protected readonly levels: LogLevels
  protected readonly defaultEventCode: EventT | undefined
  protected readonly resolveLevel: LevelResolver<EventT>
  protected readonly transformer: Transformer<EventT> | undefined
  protected readonly formatter: Formatter

  constructor(
    protected config: LoggerConfig<EventT>,
    private scope: Record<string, any> = {}
  ) {
    const { level, levels, defaultEventCode, resolveLevel, transformer, formatter } = config
    this.defaultEventCode = defaultEventCode
    this.levels = levels || defaultLevels
    this.minLevel = getLevelNumber(level, this.levels)
    this.resolveLevel = resolveLevel || (defaultResolver as LevelResolver<EventT>)
    this.formatter = formatter || jsonFormatter({})
    this.transformer = transformer
  }

  public log(...args: LogMethodInput): void {
    const [messageOrData, eventDataOrNull] = args
    let message = messageOrData as string
    let eventData = eventDataOrNull

    if (typeof messageOrData === 'object') {
      message = ''
      eventData = messageOrData
    }
    this.writeLog('debug', this.defaultEventCode, message, eventData)
  }

  public write(...args: WriteMethodInput): void {
    const [levelOrEventCode, messageOrData, eventDataOrNull] = args
    let message = messageOrData as string
    let eventData = eventDataOrNull
    let level = levelOrEventCode as LogLevel
    let eventCode = this.defaultEventCode

    if (typeof messageOrData === 'object') {
      message = ''
      eventData = messageOrData
    }

    if (!this.levels[levelOrEventCode as LogLevel]) {
      level = this.resolveLevel(levelOrEventCode as EventT)
      eventCode = levelOrEventCode as EventT
    }
    this.writeLog(level, eventCode, message, eventData)
  }

  protected getScopedLoggerConfig(
    scope: Record<string, any>,
    loggerConfig?: Partial<LoggerConfig<EventT>>
  ): [LoggerConfig<EventT>, Record<string, any>] {
    return [
      {
        ...this.config,
        ...loggerConfig,
      },
      inheritObjects(this.scope, scope),
    ]
  }

  protected writeLog(
    level: LogLevel,
    eventCode: EventT | undefined,
    message: string,
    eventData?: Record<string, any>
  ): void {
    const levelNumber = this.levels[level]
    if (levelNumber < this.minLevel) return

    const { config, scope, transformer, formatter } = this
    return print<EventT>({
      data: {
        level,
        levelNumber,
        eventCode,
        message,
        src: config.includeSrc ? getSrcInfo(2) : undefined,
        scope: pick(scope, getInheritedProperties(scope)) as Record<string, any>,
        eventData,
      },
      transformer,
      formatter,
    })
  }
}
