import { defaultLevels } from '../../consts'
import { LogLevel } from '../../types'
import { cliFormatter } from '../cli-formatter.factory'
import { removeFields } from '../../processors'

describe('Transformers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should transform to cli output', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-07-08T09:10:11.120Z'))
    const scope = {
      scopeInfo: 'test',
      test: 'scope',
    }
    const eventData = {
      eventDataInfo: 'test',
    }
    const src = {
      file: 'test',
      func: 'test',
      line: 1,
      position: 1,
    }
    const input = {
      level: 'info' as LogLevel,
      eventCode: 'test-code',
      levelNumber: defaultLevels.info,
      message: 'test-cli',
      scope,
      eventData: {
        ...eventData,
        authorization: 'authorization',
      },
      src,
    }
    const processor = removeFields({ ignoreFields: ['authorization'] })
    const output = cliFormatter({ processor })(input)
    expect(output).toEqual(
      `[${new Date().toISOString()}] ${input.level.toUpperCase()}: ${input.eventCode} ${
        input.message
      }\n ${JSON.stringify(
        {
          src,
          ...scope,
          ...eventData,
        },
        undefined,
        2
      )}`
    )
  })
})
