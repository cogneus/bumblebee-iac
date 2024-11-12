import { APIGatewayProxyEventHeaders } from 'aws-lambda'
import { jwtDecode } from 'jwt-decode'
import { InvalidToken } from '../exceptions'
import { getTokenFromHeaders } from './get-token-from-headers'

export const decodeToken = <TToken>(headers: APIGatewayProxyEventHeaders): TToken => {
  try {
    const bearerToken = getTokenFromHeaders(headers)
    if (!bearerToken) {
      throw InvalidToken()
    }
    return jwtDecode(bearerToken) as TToken
  } catch {
    throw InvalidToken()
  }
}
