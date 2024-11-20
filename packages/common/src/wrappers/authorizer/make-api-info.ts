import { APIGatewayRequestAuthorizerEventV2, APIGatewayRequestAuthorizerEvent } from 'aws-lambda'
import { APIGatewayInfo } from './types'
import { WrapperBaseParams } from '../types'

// arn:aws:execute-api:{region}:{accountId}:{appId}/$default/POST/v1/path
export const makeAPIInfo = (
  event: APIGatewayRequestAuthorizerEventV2 | APIGatewayRequestAuthorizerEvent,
  { region }: WrapperBaseParams
): APIGatewayInfo => {
  const {
    requestContext: { apiId: id },
    routeArn,
    methodArn,
  } = event as (APIGatewayRequestAuthorizerEventV2 & APIGatewayRequestAuthorizerEvent)
  const arn = (routeArn ?? methodArn).split('/')[0]
  return { arn, region, id }
}
