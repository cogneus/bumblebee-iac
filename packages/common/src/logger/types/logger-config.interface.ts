import { Formatter } from './formatter.interface'
import { Transformer } from './transformer.interface'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'
export type LogLevelUC = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
export type LogLevels = { [key in LogLevel]: number }
export type LevelResolver<EventT> = (code?: EventT) => LogLevel

/**
 * LoggerConfig provides control of logging format
 * @member {LogLevel?} level will limit output to specified level and above
 * @member {string[]?} ignoreFields if no formatter is provided, will be used to omit named object properties from the output
 * @member {string?} defaultEventCode provides a fallback eventcode when one can't be derived from the params
 * @member {Transformer<EventT>?} transformer override default log output
 * @member {LogLevels?} levels override default numeric values for log
 * @member {boolean?} includeSrc the calling source info will be included in the log output
 * @member {Formatter?} format formats json into specic string
 * @member {LevelResolver<EventT>?} resolveLevel a function that will return a level for an eventCode. Some apps include level info in the eventCode when calling the logger.write function
 */

export interface LoggerConfig<EventT = string> {
  level?: LogLevel | LogLevelUC
  ignoreFields?: string[]
  defaultEventCode?: EventT
  levels?: LogLevels
  includeSrc?: boolean
  formatter?: Formatter
  resolveLevel?: LevelResolver<EventT>
  transformer?: Transformer<EventT>
}
