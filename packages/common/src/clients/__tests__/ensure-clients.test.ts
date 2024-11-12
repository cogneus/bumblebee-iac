import { IDBClient } from '../db'
import { clients, clientOptions } from '../__mocks__/clients.const'
import { ServiceContext } from '../../types'
import { ISMClient } from '../ssm'
import { ensureClient } from '../ensure-client'
import { ISecretsClient } from '../secrets'
import { InvalidService } from '../../exceptions'
import { ConsoleLogger } from '../../logger'

describe('Destroy clients tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const log = new ConsoleLogger({})
  const context: ServiceContext = {
    clients,
    clientOptions,
    log,
  } as unknown as ServiceContext

  test('should ensure clients', async () => {
    const db = ensureClient<IDBClient>(context, 'db')
    const ssm = ensureClient<ISMClient>(context, 'ssm')
    const secrets = ensureClient<ISecretsClient>(context, 'secrets')
    const dbFromOptions = ensureClient<IDBClient>(
      { clientOptions, log } as unknown as ServiceContext,
      'db'
    )

    expect(db.tables).toBe(clientOptions.db?.tables)
    expect(dbFromOptions.tables).toBe(clientOptions.db?.tables)
    expect(ssm.names).toBe(clientOptions.ssm?.names)
    expect(secrets.names).toBe(clientOptions.secrets?.names)
  })

  test('should throw an error', async () => {
    expect(() => ensureClient<IDBClient>({} as ServiceContext, 'db')).toThrow(InvalidService('db'))
    expect(() => ensureClient<ISMClient>({} as ServiceContext, 'ssm')).toThrow(
      InvalidService('ssm')
    )
    expect(() => ensureClient<ISecretsClient>({} as ServiceContext, 'secrets')).toThrow(
      InvalidService('secrets')
    )
  })
})
