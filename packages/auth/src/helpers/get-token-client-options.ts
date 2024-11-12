import { ClientOptions } from 'bumblebee-common'
import { env } from 'process'

export const getTokenClientOptions = (): ClientOptions => {
  const {
    RESOURCE_NAME_PREFIX,
    KMS_ID,
    SECRET_ARN_PREFIX,
    SECRET_SIGNING_KEY_NAME,
    SECRET_TOKENS_NAME,
    SECRET_USERS_NAME,
  } = env
  return {
    secrets: {
      idPrefix: SECRET_ARN_PREFIX,
      prefix: RESOURCE_NAME_PREFIX,
      names: {
        tokens: { name: SECRET_TOKENS_NAME },
      },
      ids: {
        authSigningKey: { name: SECRET_SIGNING_KEY_NAME },
        users: { name: SECRET_USERS_NAME },
      },
      kmsId: KMS_ID,
    },
  }
}
