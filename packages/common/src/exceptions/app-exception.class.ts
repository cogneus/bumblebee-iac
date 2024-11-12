import { IAppExceptionParams } from './types'

export class AppException extends Error {
  public status: number
  public code: string
  constructor({ code, status, message, source }: IAppExceptionParams) {
    super(message)
    this.name = 'AppException'
    this.status = status
    this.code = code
    Error.captureStackTrace(source)
  }
}
