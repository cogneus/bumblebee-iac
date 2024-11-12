import { EventData } from './event-data.interface'
import { LogLevel } from './logger-config.interface'

/**
 * @param {string} messageOrData - short and descriptive message to be logged or any data what provides additional context
 * @param {object} eventData - any data what provides additional context
 */
export type LogMethodInput = Parameters<
  (messageOrData: string | EventData, eventData?: EventData) => void
>

/**
 * @param {string} levelOrEventCode - log level or application specific event code which can be used to identify specific events in the system
 * @param {string} messageOrData - short and descriptive message to be logged or any data what provides additional context
 * @param {object} eventData - any data what provides additional context
 */
export type WriteMethodInput = Parameters<
  (
    levelOrEventCode: string | LogLevel,
    messageOrData: string | EventData,
    eventData?: EventData
  ) => void
>

/**
 * Base logger implementation that can be extended to support different interfaces or scenarios
 */
export interface BaseLoggerInterface {
  log(...args: LogMethodInput): void
  write(...args: WriteMethodInput): void
}
