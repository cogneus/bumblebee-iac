import { sign } from 'jsonwebtoken'
import { Token } from 'bumblebee-common'
import { TokenResponse, TokenServiceAttrs } from '../../types'

export const generateToken = async (
  key: string,
  params: Token,
  serviceAttrs: TokenServiceAttrs
): Promise<TokenResponse> => {
  const token = sign(params, key, {
    ...serviceAttrs,
    algorithm: 'RS256',
  })
  return {
    token,
  }
}
