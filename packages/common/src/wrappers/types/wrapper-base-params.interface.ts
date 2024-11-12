import { LogLevel } from '../../logger'

export interface WrapperBaseParams {
  serviceName: string
  region: string
  env: string
  logName: string
  logLevel?: LogLevel
}
