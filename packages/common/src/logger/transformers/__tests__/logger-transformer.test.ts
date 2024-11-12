import { defaultLevels } from '../../consts'
import { LogLevel } from '../../types'
import { loggerTransformer } from '../logger-transformer'

describe('Transformers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should transform to logger output', () => {
    const scope = {
      scopeInfo: 'test',
      test: 'scope',
    }
    const eventData = {
      eventDataInfo: 'test',
      test: 'eventData',
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
      eventData,
      src,
    }
    const output = loggerTransformer()(input)
    expect(output).toEqual({
      status: input.level,
      level: input.levelNumber,
      logLevel: input.level.toUpperCase(),
      eventCode: input.eventCode,
      src,
      msg: input.message,
      ...scope,
      ...eventData,
    })
  })
})
