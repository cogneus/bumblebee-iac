import { LoggerConfig } from '../types'
import { loggerTransformer } from '../transformers'
import { getSrcInfo, print } from '../utils'
import { BaseConsoleLogger } from '../base-console-logger'
import { defaultLevels } from '../consts'

jest.mock('../utils/print-log')

const config: LoggerConfig = {
  level: 'info',
  ignoreFields: [],
  defaultEventCode: 'unknown-event',
  transformer: loggerTransformer(),
}

const scope = {}

describe('Console Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const printMock = (print as jest.Mock).mockImplementation(jest.fn())

  test('should write generic logs in an appropriate format', () => {
    const message = 'Log message'
    const eventData = { some: 'data' }
    const level = 'debug'

    new BaseConsoleLogger(
      {
        ...config,
        level,
      },
      scope
    ).log(message, eventData)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode: config.defaultEventCode,
      message,
      scope,
      eventData,
    })
  })

  test('should write generic log messages in an appropriate format', () => {
    const message = 'Log message'
    const level = 'debug'
    new BaseConsoleLogger(
      {
        ...config,
        level,
      },
      scope
    ).log(message)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode: config.defaultEventCode,
      message,
      scope,
    })
  })

  test('should write generic log objects in an appropriate format', () => {
    const eventData = { some: 'data' }
    const level = 'debug'

    new BaseConsoleLogger(
      {
        ...config,
        level,
      },
      scope
    ).log(eventData)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode: config.defaultEventCode,
      message: '',
      eventData,
      scope,
    })
  })

  test('should write custom logs in an appropriate format', () => {
    const eventData = { some: 'data' }
    const message = 'Log message'
    const level = 'debug'

    new BaseConsoleLogger(
      {
        ...config,
        level,
      },
      scope
    ).write(level, message, eventData)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode: config.defaultEventCode,
      message,
      eventData,
      scope,
    })
  })

  test('should write custom log messages in an appropriate format', () => {
    const message = 'Log message'
    const level = 'debug'

    new BaseConsoleLogger(
      {
        ...config,
        level,
      },
      scope
    ).write(level, message)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode: config.defaultEventCode,
      message,
      scope,
    })
  })

  test('should write custom log objects in an appropriate format', () => {
    const eventData = { some: 'data' }
    const level = 'debug'

    new BaseConsoleLogger(
      {
        ...config,
        level,
      },
      scope
    ).write(level, eventData)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode: config.defaultEventCode,
      message: '',
      eventData,
      scope,
    })
  })

  test('should write custom log codes in an appropriate format', () => {
    const eventData = { some: 'data' }
    const message = 'Log message'
    const level = 'debug'
    const eventCode = 'event-code'

    new BaseConsoleLogger(
      {
        ...config,
        level,
        resolveLevel: () => level,
      },
      scope
    ).write(eventCode, message, eventData)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode,
      message,
      eventData,
      scope,
    })
  })

  test('should write custom log codes and messages in an appropriate format', () => {
    const message = 'Log message'
    const level = 'debug'
    const eventCode = 'event-code'

    new BaseConsoleLogger(
      {
        ...config,
        level,
        resolveLevel: () => level,
      },
      scope
    ).write(eventCode, message)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode,
      message,
      scope,
    })
  })

  test('should write custom log codes and objects in an appropriate format', () => {
    const eventData = { some: 'data' }
    const level = 'debug'
    const eventCode = 'event-code'

    new BaseConsoleLogger(
      {
        ...config,
        level,
        resolveLevel: () => level,
      },
      scope
    ).write(eventCode, eventData)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode,
      message: '',
      scope,
      eventData,
    })
  })

  test('should write src data in an appropriate format', () => {
    const eventData = { some: 'data' }
    const level = 'debug'
    const file = getSrcInfo()?.file
    function testSrc() {
      new BaseConsoleLogger(
        {
          ...config,
          level,
          includeSrc: true,
        },
        scope
      ).write(level, eventData)
    }
    testSrc()
    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode: config.defaultEventCode,
      message: '',
      eventData,
      scope,
      src: {
        file,
        func: 'testSrc',
        line: 240,
        position: 9,
      },
    })
  })

  describe('Scoped logger hierarchy', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should log scope passed into the initial logger', () => {
      const appScope = { projectName: 'bumblebee-service' }

      new BaseConsoleLogger({ ...config, level: 'debug' }, appScope).log('Log message')

      const [{ data: calledWith }] = printMock.mock.calls[0]

      expect(calledWith.level).toBe('debug')
      expect(calledWith.scope).toEqual(expect.objectContaining(appScope))
    })
  })
})
