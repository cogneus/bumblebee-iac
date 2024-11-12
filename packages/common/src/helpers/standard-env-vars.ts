import { env } from 'process'
import { LogLevel } from '../logger'

export const standardEnvVars = (): {
  logLevel: LogLevel
  env: string
  region: string
} => {
  const { NODE_ENV, LOG_LEVEL, REGION } = env
  return {
    env: NODE_ENV as string,
    region: REGION as string,
    logLevel: LOG_LEVEL as LogLevel,
  }
}
