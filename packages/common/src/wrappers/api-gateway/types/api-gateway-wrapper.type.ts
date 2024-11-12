import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { APIGatewayWrapperParams } from './api-gateway-wrapper-params.interface'

export type APIGatewayWrapper = <TPayload, TParams, TToken, TResult>(
  params: APIGatewayWrapperParams<TPayload, TParams, TToken, TResult>
) => APIGatewayProxyHandlerV2
