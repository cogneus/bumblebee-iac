import { Token } from 'bumblebee-common'
import fs from 'fs'
import path from 'path'
import { generateToken } from '../generate-token'
import { TokenServiceAttrs } from '../../../types'
import { verifyToken } from '../verify-token'

const file = path.join(__dirname, './', 'test-key.key')
const key = fs.readFileSync(file, 'utf8')

describe('Generate token tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  const tokenParams: Token = {
    email: 'someone@test.com',
    givenName: 'Test',
    legalName: 'User',
    rights: [],
    subject: 'test',
    uid: 'id',
  }

  const serviceAttrs: TokenServiceAttrs = {
    audience: 'audience',
    issuer: 'issuer',
    expiresIn: '12h',
  }

  test('should generate and decode a token', async () => {
    const { token } = await generateToken(key, tokenParams, serviceAttrs)
    const decoded = await verifyToken(key, token, serviceAttrs)
    expect({ token, decoded }).toMatchSnapshot()
  })
})
