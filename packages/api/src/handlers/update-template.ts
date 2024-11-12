import { apiGatewayWrapper, warmupWrapper, standardEnvVars, Token } from 'bumblebee-common'
import { TemplateItem, TemplateVersion, updateTemplate } from 'bumblebee-services'
import { checkAPIEnvironmentVars, checkWritePermissions, getClientOptions } from '../helpers'
import { TemplatesParams } from '../types'

checkAPIEnvironmentVars()

export const main = warmupWrapper(
  apiGatewayWrapper<TemplateItem, TemplatesParams, Token, TemplateVersion>({
    handler: ({ payload, params: { id }, serviceContext }) =>
      updateTemplate(serviceContext, id!, payload),
    ...standardEnvVars(),
    serviceName: 'template-api',
    logName: 'update-template',
    getClientOptions,
    authCheck: checkWritePermissions,
  })
)
