import { fromBase64, toBase64 } from '../base64-conversion'

describe('Base64 conversion tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const data = {
    test: 'test',
  }

  const data64 = 'eyJ0ZXN0IjoidGVzdCJ9'

  test('decoded should match encoded', () => {
    expect(toBase64(data)).toBe(data64)
  })

  test('encoded should match decoded', () => {
    expect(fromBase64(data64)).toStrictEqual(data)
  })
})
