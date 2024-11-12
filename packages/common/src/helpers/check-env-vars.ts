import { env } from 'process'
import { EnvVarNotFound } from '../exceptions'

export const checkEnvironmentVariables = (keys: string[]) => {
  const missing = keys.filter(
    (key) => env[key] === null || env[key] === undefined || env[key] === ''
  )
  if (missing.length) {
    throw EnvVarNotFound(missing)
  }
}
