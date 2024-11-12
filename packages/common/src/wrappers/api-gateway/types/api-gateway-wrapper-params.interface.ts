import { ClientOptions } from '../../../clients'
import { APIGatewayHandler } from './api-gateway-handler.type'
import { APIGatewayAuthChecker } from './api-gateway-auth-checker.type'
import { WrapperParams } from '../../types'
export interface APIGatewayWrapperParams<TPayload, TParams, TToken, TResult>
  extends WrapperParams<
    APIGatewayHandler<TPayload, TParams, TResult>,
    (params: TParams) => ClientOptions
  > {
  authCheck: APIGatewayAuthChecker<TToken>
}
