import { getTokenServiceAttrs } from '../get-token-service-attrs'

describe('Get token service attrs tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
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
