import { genericWrapper, checkEnvironmentVariables, standardEnvVars } from 'bumblebee-common'
import { getTokenClientOptions } from '../helpers'
import { generateUserTokens } from '../services/users'

checkEnvironmentVariables([
  'RESOURCE_NAME_PREFIX',
  'KMS_ID',
  'SECRET_ARN_PREFIX',
  'SECRET_SIGNING_KEY_NAME',
  'SECRET_TOKENS_NAME',
  'SECRET_USERS_NAME',
  'TOKEN_AUDIENCE',
  'TOKEN_ISSUER',
  'TOKEN_EXPIRY',
])

export const main = genericWrapper({
  handler: async ({ serviceContext }) => generateUserTokens(serviceContext),
  ...standardEnvVars(),
  serviceName: 'authorizer',
  logName: 'authorize',
  getClientOptions: getTokenClientOptions,
})
