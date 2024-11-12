import {
  apiGatewayWrapper,
  warmupWrapper,
  standardEnvVars,
  PagedItems,
  Token,
} from 'bumblebee-common'
import { QueryParams, TemplateVersion, queryTemplates } from 'bumblebee-services'
import {
  checkAPIEnvironmentVars,
  checkReadPermissions,
  getClientOptions,
  tryParseValue,
} from '../helpers'
import { TemplatesParams } from '../types'

checkAPIEnvironmentVars()

export const main = warmupWrapper(
  apiGatewayWrapper<QueryParams, TemplatesParams<QueryParams>, Token, PagedItems<TemplateVersion>>({
    handler: ({
      payload,
      params: { group, sort, cursor, limit, source, target },
      serviceContext,
    }) =>
      queryTemplates(serviceContext, group!, {
        sort,
        cursor,
        limit: tryParseValue<number | undefined>(limit, 'number'),
        source,
        target,
        ...payload,
      }),
    ...standardEnvVars(),
    serviceName: 'template-api',
    logName: 'query-template',
    getClientOptions,
    authCheck: checkReadPermissions,
  })
)
