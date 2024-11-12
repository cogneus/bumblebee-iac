import { ClientOptions } from 'bumblebee-common'
import { env } from 'process'

export const getAuthClientOptions = (): ClientOptions => {
  const { RESOURCE_NAME_PREFIX, SECRET_ARN_PREFIX, KMS_ID, SECRET_SIGNING_KEY_NAME } = env
  return {
    secrets: {
      idPrefix: SECRET_ARN_PREFIX,
      prefix: RESOURCE_NAME_PREFIX,
      names: {},
      ids: {
        authSigningKey: { name: SECRET_SIGNING_KEY_NAME },
      },
      kmsId: KMS_ID,
    },
  }
}
