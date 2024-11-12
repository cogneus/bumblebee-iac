import { ISecretsClient, SecretsClientMock, ServiceContext } from 'bumblebee-common'
import { getSigningKey } from '../get-signing-key'
import { AuthExceptionCodes } from '../../exceptions/exception-codes'

describe('Get signing key tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const secretsClient: ISecretsClient = new SecretsClientMock({
    prefix: 'test-prefix',
    idPrefix: 'test-prefix',
    names: {
      authSigningKey: { name: 'authSigningKey' },
    },
    ids: {
      authSigningKey: { name: 'authSigningKey' },
    },
    kmsId: 'test-kms',
  })

  test('should return the value of the secrets key', async () => {
    const keyValue = 'test'
    ;(secretsClient.getValue as jest.Mock).mockResolvedValueOnce(keyValue)
    const value = await getSigningKey({
      clients: { secrets: secretsClient },
    } as ServiceContext)
    expect(value).toBe(keyValue)
  })

  test("should throw an error if the key doesn't exist", async () => {
    let code = null
    try {
      ;(secretsClient.getValue as jest.Mock).mockResolvedValueOnce(null)
      await getSigningKey({
        clients: { secrets: secretsClient },
      } as ServiceContext)
    } catch (ex) {
      code = ex.code
    }

    expect(code).toBe(AuthExceptionCodes.KeyNotFound)
  })
})
