import { getTokenClientOptions } from '../get-token-client-options'

describe('Get auth client options tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      AWS_REGION: 'eu-west-1',
      LOG_LEVEL: 'debug',
      NODE_ENV: 'dev',
      RESOURCE_NAME_PREFIX: 'test-prefix',
      SECRET_SIGNING_KEY_NAME: 'signingKey',
      TOKEN_AUDIENCE: 'audience',
      TOKEN_EXPIRY: 'expiry',
      TOKEN_ISSUER: 'issuer',
      SECRET_TOKENS_NAME: 'tokens',
      SSM_NAME_PREFIX: 'ssm-prefix',
      SSM_USERS_NAME: 'users',
    } as any
  })

  test('should return the value of the secrets key', async () => {
    const value = getTokenClientOptions()
    expect(value).toMatchSnapshot()
  })
})
