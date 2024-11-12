import { Factory, Transformer } from '../types'

export const loggerTransformer: Factory<Transformer> =
  () =>
  ({ level, levelNumber, eventCode, message, scope, src, eventData }) => ({
    status: level,
    level: levelNumber,
    logLevel: level.toUpperCase(),
    ...(eventCode ? { eventCode } : {}),
    ...(src ? { src } : {}),
    ...(message ? { msg: message } : {}),
    ...scope,
    ...eventData,
  })
