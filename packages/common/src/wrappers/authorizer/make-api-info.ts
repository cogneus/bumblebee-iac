import { APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda'
import { APIGatewayInfo } from './types'
import { WrapperBaseParams } from '../types'

// arn:aws:execute-api:{region}:{accountId}:{appId}/$default/POST/v1/path
export const makeAPIInfo = (
  event: APIGatewayRequestAuthorizerEventV2,
  { region }: WrapperBaseParams
): APIGatewayInfo => {
  const {
    requestContext: { apiId: id },
    routeArn,
  } = event
  const arn = routeArn.split('/')[0]
  return { arn, region, id }
}
