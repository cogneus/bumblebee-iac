import { apiGatewayWrapper, warmupWrapper, standardEnvVars, Token } from 'bumblebee-common'
import { TemplateVersion, getTemplate } from 'bumblebee-services'
import { checkAPIEnvironmentVars, checkReadPermissions, getClientOptions } from '../helpers'
import { TemplatesParams } from '../types'

checkAPIEnvironmentVars()

export const main = warmupWrapper(
  apiGatewayWrapper<any, TemplatesParams, Token, TemplateVersion>({
    handler: ({ params: { id, version }, serviceContext }) =>
      getTemplate(serviceContext, id!, version),
    ...standardEnvVars(),
    serviceName: 'template-api',
    logName: 'get-template',
    getClientOptions,
    authCheck: checkReadPermissions,
  })
)
