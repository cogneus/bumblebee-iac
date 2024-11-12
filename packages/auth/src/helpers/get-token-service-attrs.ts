import { env } from 'process'
import { TokenServiceAttrs } from '../types'

export const getTokenServiceAttrs = (): TokenServiceAttrs => {
  const { TOKEN_AUDIENCE, TOKEN_EXPIRY, TOKEN_ISSUER } = env
  return {
    audience: TOKEN_AUDIENCE,
    expiresIn: TOKEN_EXPIRY,
    issuer: TOKEN_ISSUER,
  }
}
