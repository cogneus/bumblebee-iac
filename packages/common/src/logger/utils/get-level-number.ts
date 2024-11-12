import { LogLevel, LogLevelUC, LogLevels } from '../types'

export const getLevelNumber = (
  level: LogLevel | LogLevelUC | undefined | null,
  levels: LogLevels
): number => (level ? levels[level.toLowerCase() as LogLevel] : levels.info)
