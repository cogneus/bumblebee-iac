import {
  apiGatewayWrapper,
  warmupWrapper,
  standardEnvVars,
  PagedItems,
  Token,
} from 'bumblebee-common'
import { ListParams, TemplateVersion, templateVersions } from 'bumblebee-services'
import {
  checkAPIEnvironmentVars,
  checkReadPermissions,
  getClientOptions,
  tryParseValue,
} from '../helpers'
import { TemplatesParams } from '../types'

checkAPIEnvironmentVars()

export const main = warmupWrapper(
  apiGatewayWrapper<ListParams, TemplatesParams<ListParams>, Token, PagedItems<TemplateVersion>>({
    handler: ({
      payload,
      params: { id, sort, cursor, limit, fields, includeCurrent },
      serviceContext,
    }) =>
      templateVersions(serviceContext, id!, {
        sort,
        cursor,
        limit: tryParseValue<number | undefined>(limit, 'number'),
        fields,
        includeCurrent: tryParseValue<boolean | undefined>(includeCurrent, 'boolean'),
        ...payload,
      }),
    ...standardEnvVars(),
    serviceName: 'template-api',
    logName: 'template-versions',
    getClientOptions,
    authCheck: checkReadPermissions,
  })
)
