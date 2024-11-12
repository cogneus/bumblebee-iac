import { getTokenServiceAttrs } from '../get-token-service-attrs'

describe('Get token service attrs tests', () => {
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
    } as any
  })

  test('should return the value of the secrets key', async () => {
    const value = getTokenServiceAttrs()
    expect(value).toMatchSnapshot()
  })
})
