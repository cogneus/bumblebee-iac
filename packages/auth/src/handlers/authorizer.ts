import {
  simpleAuthorizerWrapper,
  checkEnvironmentVariables,
  standardEnvVars,
  Token,
} from 'bumblebee-common'
import { getSigningKey, verifyToken } from '../services'
import { getAuthClientOptions, getTokenServiceAttrs } from '../helpers'

checkEnvironmentVariables([
  'KMS_ID',
  'RESOURCE_NAME_PREFIX',
  'SECRET_ARN_PREFIX',
  'SECRET_SIGNING_KEY_NAME',
  'TOKEN_AUDIENCE',
  'TOKEN_ISSUER',
  'TOKEN_EXPIRY',
])

export const main = simpleAuthorizerWrapper({
  handler: async ({ token, serviceContext }) => {
    const key = await getSigningKey(serviceContext)
    const serviceAttrs = getTokenServiceAttrs()
    return verifyToken<Token>(key, token, serviceAttrs)
  },
  ...standardEnvVars(),
  serviceName: 'authorizer',
  logName: 'authorize',
  getClientOptions: getAuthClientOptions,
})
