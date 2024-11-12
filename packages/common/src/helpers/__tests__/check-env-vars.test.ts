import { EnvVarNotFound } from '../../exceptions'
import { checkEnvironmentVariables } from '../check-env-vars'

describe('Check environment vars tests ', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      isEmpty: '',
      isUndefined: undefined,
      isNull: null,
      isOk: 'test',
    } as any
  })

  test('should throw an error', async () => {
    expect(() => checkEnvironmentVariables(['isEmpty', 'isUndefined', 'isNull', 'isOk'])).toThrow(
      EnvVarNotFound(['isEmpty', 'isUndefined', 'isNull'])
    )
  })

  test('should not throw an error', async () => {
    expect(() => checkEnvironmentVariables(['isOk'])).not.toThrow()
  })
})
