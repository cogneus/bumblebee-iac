import { defaultLevels } from '../../consts'
import { LogLevel, LogLevelUC } from '../../types'
import { getLevelNumber } from '../get-level-number'

describe('Get log level number utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const inputs: {
    level: LogLevel | LogLevelUC | string
    value: number | undefined
  }[] = [
    { level: 'info', value: defaultLevels.info },
    { level: 'INFO', value: defaultLevels.info },
    { level: 'unknown', value: undefined },
  ]

  it.each(inputs)("should return log number for level text '%s'", ({ level, value }) => {
    expect(getLevelNumber(level as any, defaultLevels)).toBe(value)
  })
})
