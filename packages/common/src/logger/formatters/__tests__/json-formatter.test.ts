import { LogLevel } from '../../types'
import { jsonFormatter } from '../json-formatter.factory'
import { defaultLevels } from '../../consts'
import { removeFields } from '../../processors'

describe('Format log utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const level: LogLevel = 'info'
  const input: Record<string, unknown> = {
    level,
    eventCode: 'test-code',
    levelNumber: defaultLevels[level],
    message: 'testMessage',
    scope: {},
  }

  test('should apply simple stringify for non-dev', () => {
    const output = jsonFormatter({ style: 'raw' })(input)

    expect(output).toMatch(JSON.stringify(input))
  })

  test('should apply pretty stringify for dev', () => {
    const output = jsonFormatter({ style: 'pretty' })(input)

    expect(output).toMatch(JSON.stringify(input, undefined, 2))
  })

  test('should ignore fields matching ignoreFields array', () => {
    const processor = removeFields({ ignoreFields: ['authorization'] })
    const output = jsonFormatter({ style: 'raw', processor })({
      ...input,
      authorization: 'token',
    })

    expect(output).toMatch(JSON.stringify(input))
  })
})
