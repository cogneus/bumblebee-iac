import { apiGatewayWrapper, warmupWrapper, Token, standardEnvVars } from 'bumblebee-common'
import { TemplateItem, TemplateVersion, addTemplate } from 'bumblebee-services'
import { checkAPIEnvironmentVars, checkWritePermissions, getClientOptions } from '../helpers'
import { TemplatesParams } from '../types'

checkAPIEnvironmentVars()

export const main = warmupWrapper(
  apiGatewayWrapper<TemplateItem, TemplatesParams, Token, TemplateVersion>({
    handler: ({ payload, serviceContext }) => addTemplate(serviceContext, payload),
    ...standardEnvVars(),
    serviceName: 'template-api',
    logName: 'add-template',
    getClientOptions,
    authCheck: checkWritePermissions,
  })
)
