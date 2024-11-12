import { verify } from 'jsonwebtoken'
import { TokenServiceAttrs } from '../../types'

export const verifyToken = async <TToken>(
  key: string,
  token: string,
  { audience, issuer }: TokenServiceAttrs
): Promise<TToken> =>
  verify(token, key, {
    audience,
    issuer,
    algorithm: 'RS256',
  })
