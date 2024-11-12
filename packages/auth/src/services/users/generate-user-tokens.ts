import { SecretsClient, ServiceContext, Token, ensureClient } from 'bumblebee-common'
import { getSigningKey } from '../signing'
import { getTokenServiceAttrs } from '../../helpers'
import { generateToken } from '../token'

export const generateUserTokens = async (serviceContext: ServiceContext) => {
  const secrets = ensureClient<SecretsClient>(serviceContext, 'secrets')
  const usersConfig = await secrets.getValue(secrets.ids.users.name)
  const key = await getSigningKey(serviceContext)
  const users: Token[] = usersConfig ? JSON.parse(usersConfig) : []
  const serviceAttrs = getTokenServiceAttrs()
  const promises = users.map((user) => generateToken(key, user, serviceAttrs))
  const tokenResponses = await Promise.all(promises)
  const tokens = tokenResponses.reduce((collection, { token }, index) => {
    const { subject } = users[index]
    return {
      ...collection,
      [subject]: token,
    }
  }, {})
  await secrets.setValue(`${secrets.names.tokens.name}`, tokens)
}
