import { ConsoleLogger } from '../console-logger'
import { LogLevel, LoggerConfig } from '../types'
import { print } from '../utils'
import { defaultLevels } from '../consts'
import { loggerTransformer } from '../transformers'

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

  test('should implement Logger Interface', () => {
    const logger = new ConsoleLogger(config)

    expect(logger.trace).toBeInstanceOf(Function)
    expect(logger.debug).toBeInstanceOf(Function)
    expect(logger.info).toBeInstanceOf(Function)
    expect(logger.warn).toBeInstanceOf(Function)
    expect(logger.error).toBeInstanceOf(Function)
    expect(logger.getScopedLogger).toBeInstanceOf(Function)
  })

  test('should skip logs with priority less than provided', () => {
    const logger = new ConsoleLogger(config)
    const eventData = { evenCode: 'bumblebee-gen-i001' }
    logger.trace('Trace', eventData)
    logger.debug('Debug', eventData)
    logger.info('Info', eventData)

    expect(printMock.mock.calls.length).toBe(1)
    expect(printMock.mock.calls[0][0].data.level).toBe('info')
  })

  test('should write the log in an appropriate format', () => {
    const eventCode = 'bumblebee-gen-i001'
    const message = 'Log message'
    const trMetadata = { some: 'data' }
    const eventData = { ...trMetadata, eventCode }
    const level = config.level as LogLevel
    new ConsoleLogger(config).info(message, eventData)

    expect(printMock.mock.calls[0][0].data).toEqual({
      level,
      levelNumber: defaultLevels[level],
      eventCode,
      message,
      eventData: trMetadata,
      scope,
    })
  })

  test('should skip trMetadata when it does not passed', () => {
    new ConsoleLogger(config).info('Log message')

    expect(printMock.mock.calls[0][0].data.eventData).not.toBeDefined()
  })

  test('should log scope passed into the initial logger', () => {
    const appScope = { projectName: 'bumblebee-service' }

    new ConsoleLogger(config, appScope).info('Log message')

    const [{ data: calledWith }] = printMock.mock.calls[0]

    expect(calledWith.level).toBe('info')
    expect(calledWith.scope).toEqual(expect.objectContaining(appScope))
  })

  test('should create a scoped logger', () => {
    const logger = new ConsoleLogger(config)

    const scopedLogger = logger.getScopedLogger({})

    expect(scopedLogger).toBeInstanceOf(ConsoleLogger)
  })

  test('should log scopes of both parent and child loggers', () => {
    const appScope = { projectName: 'bumblebee-service' }
    const requestScope = { requestId: 123 }

    new ConsoleLogger(config, appScope).getScopedLogger(requestScope).info('Log message')

    const [{ data: calledWith }] = printMock.mock.calls[0]

    expect(calledWith.level).toBe('info')
    expect(calledWith.scope).toEqual(
      expect.objectContaining({
        ...appScope,
        ...requestScope,
      })
    )
  })
})
