import { DBClientMock, SMClientMock, SecretsClientMock } from '.'
import { ClientOptions, Clients } from '../types'

export const clientOptions: ClientOptions = {
  secrets: {
    prefix: '',
    idPrefix: '',
    names: {
      test: { name: 'test' },
    },
    ids: {
      test: { name: 'test' },
    },
    kmsId: 'test-kms-key',
  },
  ssm: {
    prefix: '',
    names: {
      test: { name: 'test' },
    },
  },
  db: {
    maxAttempts: 1,
    requestTimeout: 2000,
    region: 'eu-west-1',
    tables: {
      test: {
        name: 'test',
        indices: {
          test: { name: 'test' },
        },
        itemLimits: {
          maxLimit: 20,
          defaultLimit: 20,
        },
      },
    },
  },
}

export const clients: Clients = {
  secrets: new SecretsClientMock(clientOptions.secrets!),
  ssm: new SMClientMock(clientOptions.ssm!),
  db: new DBClientMock(clientOptions.db!),
}
