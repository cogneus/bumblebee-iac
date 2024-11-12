import { apiGatewayWrapper, warmupWrapper, standardEnvVars, Token } from 'bumblebee-common'
import { removeTemplate } from 'bumblebee-services'
import { checkAPIEnvironmentVars, checkWritePermissions, getClientOptions } from '../helpers'
import { TemplatesParams } from '../types'

checkAPIEnvironmentVars()

export const main = warmupWrapper(
  apiGatewayWrapper<any, TemplatesParams, Token, void>({
    handler: ({ params: { id }, serviceContext }) => removeTemplate(serviceContext, id!),
    ...standardEnvVars(),
    serviceName: 'template-api',
    logName: 'remove-template',
    getClientOptions,
    authCheck: checkWritePermissions,
  })
)
