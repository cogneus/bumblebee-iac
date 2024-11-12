import { LogLevel } from './logger-config.interface'
import { SrcData } from './src-data.interface'

export interface TransformerInput<EventT = string> extends Record<string, any> {
  level: LogLevel
  levelNumber: number
  eventCode?: EventT
  message: string
  scope: Record<string, any>
  eventData?: Record<string, any>
  src?: SrcData
}

/**
 * Transforms log info into the desired structure.
 *
 * @param {TransformerInput<EventT>} input from the log methods
 * @param {Record<string, any>?} entry output from the previous transform
 * @returns {Record<string, any>?} entry to be written to the log
 */
export type Transformer<
  EventT = string,
  TEntry = Record<string, any>,
  TOutput = Record<string, any>,
> = (input: TransformerInput<EventT>, entry?: TEntry) => TOutput
