import { PrintInput, print } from '../print-log'
import { LogLevel } from '../../types'
import { defaultLevels } from '../../consts'

describe('Print log utils', () => {
  beforeAll(() => {
    jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn())
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const level: LogLevel = 'info'
  const input: PrintInput = {
    formatter: (data) => JSON.stringify(data),
    transformer: (input) => input,
    data: {
      eventCode: 'test-code',
      level,
      message: 'log message',
      eventData: { some: 'data' },
      levelNumber: defaultLevels[level],
      scope: {},
    },
  }

  describe('should print logs with the correct severity', () => {
    const levels: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error']

    it.each(levels)("prints log for '%s'", (level: LogLevel) => {
      const consoleSpy = jest.spyOn(process.stdout, 'write')
      const data = {
        ...input.data,
        level,
        levelNumber: defaultLevels[level],
      }
      print({ ...input, data })
      expect(consoleSpy).toHaveBeenCalledWith(`${JSON.stringify(data)}\n`)
    })
  })
})
