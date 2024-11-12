import { StatusCodes, AppException } from 'bumblebee-common'
import { AuthExceptionCodes } from './exception-codes'

export const KeyNotFound = (key: string) =>
  new AppException({
    code: AuthExceptionCodes.KeyNotFound,
    status: StatusCodes.Forbidden,
    message: `Key with name '${key}' not found`,
    source: KeyNotFound,
  })
