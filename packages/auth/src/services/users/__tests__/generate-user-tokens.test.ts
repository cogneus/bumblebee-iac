import { ISecretsClient, SecretsClientMock, ServiceContext, Token } from 'bumblebee-common'
import fs from 'fs'
import path from 'path'
import { generateUserTokens } from '../generate-user-tokens'

describe('Generate user token tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
    process.env = {
      AWS_REGION: 'eu-west-1',
      LOG_LEVEL: 'debug',
      NODE_ENV: 'dev',
      RESOURCE_NAME_PREFIX: 'test-prefix',
      SECRET_SIGNING_KEY_NAME: 'authSigningKey',
      TOKEN_AUDIENCE: 'audience',
      TOKEN_EXPIRY: '12h',
      TOKEN_ISSUER: 'issuer',
      SECRET_TOKENS_NAME: 'tokens',
      SSM_NAME_PREFIX: 'ssm-prefix',
      SSM_USERS_NAME: 'users',
    } as any
  })

  const file = path.join(__dirname, './', 'test-key.key')
  const key = fs.readFileSync(file, 'utf8')

  const secretsClient: ISecretsClient = new SecretsClientMock({
    prefix: 'test-prefix',
    idPrefix: 'test-prefix',
    names: {
      authSigningKey: { name: 'authSigningKey' },
      tokens: { name: 'tokens' },
      users: { name: 'users' },
    },
    ids: {
      authSigningKey: { name: 'authSigningKey' },
      tokens: { name: 'tokens' },
      users: { name: 'users' },
    },
    kmsId: 'test',
  })

  const users: Token[] = [
    {
      email: 'read-user@test.email',
      givenName: 'read',
      legalName: 'user',
      rights: ['read'],
      subject: 'read-user',
      uid: 'read-user',
    },
    {
      email: 'write-user@test.email',
      givenName: 'write',
      legalName: 'user',
      rights: ['write'],
      subject: 'write-user',
      uid: 'write-user',
    },
  ]
  test('should create user tokens', async () => {
    const results: any[] = []
    ;(secretsClient.getValue as jest.Mock).mockImplementation((name) =>
      name === secretsClient.names.authSigningKey.name
        ? key
        : name === secretsClient.names.users.name
        ? JSON.stringify(users)
        : null
    )
    ;(secretsClient.setValue as jest.Mock).mockImplementation((name, value) =>
      results.push({ name, value })
    )
    await generateUserTokens({
      clients: { secrets: secretsClient },
    } as ServiceContext)
    expect(results).toMatchSnapshot()
  })
})
