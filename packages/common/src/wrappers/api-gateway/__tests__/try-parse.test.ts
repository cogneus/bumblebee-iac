import { InvalidRequest } from '../../../exceptions'
import { tryParse } from '../try-parse'

describe('Try parse tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should throw an error', async () => {
    let msg: string = ''
    const input = '{test:test}'
    try {
      JSON.parse(input)
    } catch (ex) {
      msg = ex.message
    }
    expect(() => tryParse('{test:test}')).toThrow(InvalidRequest(msg))
  })

  test('should return a valid object', async () => {
    const obj = { test: 'test' }
    const input = JSON.stringify(obj)
    expect(tryParse(input)).toStrictEqual(obj)
  })

  test('should return undefined', async () => {
    expect(tryParse('')).toBe(undefined)

    expect(tryParse(undefined)).toBe(undefined)

    expect(tryParse(null)).toBe(undefined)
  })
})
