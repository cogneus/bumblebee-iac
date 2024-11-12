import { InvalidModeSource } from '../../../exceptions'
import { getModeFromArn } from '../get-mode-from-arn'

describe('Get mode from arn tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      isEmpty: '',
      isUndefined: undefined,
      isNull: null,
      isOk: 'test',
    } as any
  })

  const prefix = 'test-prefix'
  const modes = ['live', 'staging']
  test('should throw an error', async () => {
    const arn = `${prefix}-other-stage-`
    expect(() => getModeFromArn(modes, prefix, arn)).toThrow(InvalidModeSource(prefix, arn))

    expect(() => getModeFromArn(modes, undefined as any, arn)).toThrow(
      InvalidModeSource(undefined as any, arn)
    )

    expect(() => getModeFromArn(modes, prefix, undefined)).toThrow(
      InvalidModeSource(prefix, undefined)
    )
  })

  test('should not throw an error', async () => {
    const arn = `${prefix}-${modes[0]}-`
    expect(() => getModeFromArn(modes, prefix, arn)).not.toThrow()
  })
})
