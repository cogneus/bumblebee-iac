import { StatusCodes, AppException } from 'bumblebee-common'
import { TemplateExceptionCodes } from './exception-codes'

export const TemplateNotFound = (id: string) =>
  new AppException({
    code: TemplateExceptionCodes.TemplateNotFound,
    status: StatusCodes.NotFound,
    message: `Template with id '${id}' not found`,
    source: TemplateNotFound,
  })

export const EmptyRequest = () =>
  new AppException({
    code: TemplateExceptionCodes.EmptyRequest,
    status: StatusCodes.BadRequest,
    message: 'Template request data is missing',
    source: EmptyRequest,
  })

export const MissingAttributes = (keys: string[]) =>
  new AppException({
    code: TemplateExceptionCodes.MissingAttributes,
    status: StatusCodes.BadRequest,
    message: `The following attributes are mandatory ${keys.join()}`,
    source: MissingAttributes,
  })
