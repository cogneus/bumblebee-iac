import { APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda'

export const getTokenFromAuthEvent = (event: APIGatewayRequestAuthorizerEventV2) => {
  return event.identitySource[0]?.replace(/Bearer\s+/, '')
}
