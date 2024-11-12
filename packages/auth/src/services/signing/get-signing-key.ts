import { ISecretsClient, ServiceContext, ensureClient } from 'bumblebee-common'
import { KeyNotFound } from '../exceptions'

export const getSigningKey = async (context: ServiceContext): Promise<string> => {
  const secrets = ensureClient<ISecretsClient>(context, 'secrets')
  const { name } = secrets.ids.authSigningKey
  const key = await secrets.getValue(name)
  if (!key) {
    throw KeyNotFound(name)
  }
  return key
}
