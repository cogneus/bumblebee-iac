import { ClientOptions, DBClientMock, ServiceContext } from 'bumblebee-common'
import { ConsoleLogger } from 'bumblebee-common'

const clientOptions: ClientOptions = {
  db: {
    region: 'eu-west-1',
    maxAttempts: 1,
    requestTimeout: 2000,
    tables: {
      templates: {
        name: 'name-templates',
        indices: {
          groups: { name: 'name-groups' },
        },
        itemLimits: {
          defaultLimit: 20,
          maxLimit: 100,
        },
      },
    },
  },
}
export const serviceContext: ServiceContext = {
  log: new ConsoleLogger({}),
  clientOptions,
  clients: {
    db: new DBClientMock(clientOptions.db!),
  },
} as unknown as ServiceContext
