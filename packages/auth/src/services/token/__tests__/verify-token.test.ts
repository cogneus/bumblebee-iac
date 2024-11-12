import fs from 'fs'
import path from 'path'
import { TokenServiceAttrs } from '../../../types'
import { verifyToken } from '../verify-token'

const file = path.join(__dirname, './', 'test-key.key')
const key = fs.readFileSync(file, 'utf8')

describe('Verify token tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  const serviceAttrs: TokenServiceAttrs = {
    audience: 'audience',
    issuer: 'issuer',
    expiresIn: '12h',
  }

  const oldKeyToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbWVvbmVAdGVzdC5jb20iLCJnaXZlbk5hbWUiOiJUZXN0IiwibGVnYWxOYW1lIjoiVXNlciIsInJpZ2h0cyI6W10sInN1YmplY3QiOiJ0ZXN0IiwidWlkIjoiaWQiLCJpYXQiOjE2NzI1MzEyMDAsImV4cCI6MTY3MjU3NDQwMCwiYXVkIjoiYXVkaWVuY2UiLCJpc3MiOiJpc3N1ZXIifQ.MA9US__XdBWSF-87oLFJRJkLN2ja1W3DPda3XhDvToL7psbTJauUuRTO-kfql6YCM3CF_wf0qGjwZ_RP30dj5VvRrhY8yF8qsQnExbZAm_54sMGorzZ8TSCiILqjU3oHk7ulVBx88pYrXmHsmEKiZWVCiFtfejRpo9AhfaMUHVPxbKblKoGL3x2pps4JR6X3zJEalXxdLC8nP7gIL-ZL013XUWC6HRovxMicbf5cbrnRM7QG9nZHMCQFCXlfsDTQ8TtlC-jmstTjJBSiz1DVGDRX5eNSGGGvoz2FJmPjpMi4SC_1HY_TCWcGZN6fc5RnKY8N76gJHc85vl5glHFTng'
  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbWVvbmVAdGVzdC5jb20iLCJnaXZlbk5hbWUiOiJUZXN0IiwibGVnYWxOYW1lIjoiVXNlciIsInJpZ2h0cyI6W10sInN1YmplY3QiOiJ0ZXN0IiwidWlkIjoiaWQiLCJpYXQiOjE2NzI1MzEyMDAsImV4cCI6MTY3MjU3NDQwMCwiYXVkIjoiYXVkaWVuY2UiLCJpc3MiOiJpc3N1ZXIifQ.Z6i_UNl5RpmEcT0pOhdOY-RQ7lCy0PwysiY_HM_t05T4r1DmiucLzCo_MHQC32rCzCpPQbvKZ24lRU-Ww1Uk-PlHyybvhwS4SPNub7V9M4HLzi4nu25zvNXrqBkPtjmkW33u18fhPwRO-xTcg2y1vLa1OpJDNkUiTEr1d8TTq0S48fMNgCXrXu2YfDFm6HkTyVVGG3uWtlbqrEIu1cyCOijxnAH-_U0YaPgp7y33u8_uQNgfslTRU3DquJiGnuQYWwr0J4U1D81F8sJMLXGj9kSJfmqIX63QNrp7s5HeKyIQ6inQdAk3JbJ9J8APkv3imjAVBpZcDLuF8-yzYXL8XA'

  test('Should validate expiry and throw an error', async () => {
    let error
    jest.setSystemTime(new Date('2023-01-01T12:00:01Z'))
    try {
      await verifyToken(key, token, serviceAttrs)
    } catch (ex) {
      error = ex
    }
    expect(error).toMatchSnapshot()
  })

  test('Should validate audience and throw an error', async () => {
    let error
    try {
      await verifyToken(key, token, {
        ...serviceAttrs,
        audience: 'random',
      })
    } catch (ex) {
      error = ex
    }
    expect(error).toMatchSnapshot()
  })

  test('Should validate issuer and throw an error', async () => {
    let error
    try {
      await verifyToken(key, token, { ...serviceAttrs, issuer: 'random' })
    } catch (ex) {
      error = ex
    }
    expect(error).toMatchSnapshot()
  })

  test('Should validate signature and throw an error', async () => {
    let error
    try {
      await verifyToken(key, oldKeyToken, serviceAttrs)
    } catch (ex) {
      error = ex
    }
    expect(error).toMatchSnapshot()
  })
})
