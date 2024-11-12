import { AppException } from './app-exception.class'
import { ExceptionCodes } from './exception-codes'
import { StatusCodes } from './status-codes'

export const InvalidToken = () =>
  new AppException({
    code: ExceptionCodes.InvalidToken,
    status: StatusCodes.Forbidden,
    message: 'Forbidden',
    source: InvalidToken,
  })

export const InvalidAuthorizartion = () =>
  new AppException({
    code: ExceptionCodes.InvalidAuthorizartion,
    status: StatusCodes.Forbidden,
    message: 'Forbidden',
    source: InvalidAuthorizartion,
  })

export const EmptyRequest = () =>
  new AppException({
    code: ExceptionCodes.EmptyRequest,
    status: StatusCodes.BadRequest,
    message: 'Request data is missing',
    source: EmptyRequest,
  })

export const InvalidService = (service: string) =>
  new AppException({
    code: ExceptionCodes.InvalidService,
    status: StatusCodes.Error,
    message: `Invalid service. ${service}`,
    source: InvalidService,
  })

export const InvalidRequest = (innerMessage: string) =>
  new AppException({
    code: ExceptionCodes.InvalidRequest,
    status: StatusCodes.BadRequest,
    message: `Request data is invalid. ${innerMessage}`,
    source: InvalidRequest,
  })

export const MissingAttributes = (keys: string[]) =>
  new AppException({
    code: ExceptionCodes.MissingAttributes,
    status: StatusCodes.BadRequest,
    message: `The following attributes are mandatory ${keys.join()}`,
    source: MissingAttributes,
  })

export const EnvVarNotFound = (keys: string[]) =>
  new AppException({
    code: ExceptionCodes.EnvVarNotFound,
    status: StatusCodes.Error,
    message: `The following environment variables not found ${keys.join()}`,
    source: EnvVarNotFound,
  })

export const InvalidModeSource = (resourcePrefix: string, eventSourceARN: string | undefined) =>
  new AppException({
    code: ExceptionCodes.InvalidModeSource,
    status: StatusCodes.Error,
    message: `Cannot derive stage from event source. eventSourceARN: ${eventSourceARN} RESOURCE_PREFIX: ${resourcePrefix}`,
    source: InvalidModeSource,
  })
