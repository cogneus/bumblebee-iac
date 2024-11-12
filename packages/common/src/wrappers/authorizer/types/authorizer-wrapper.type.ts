import { APIGatewayRequestIAMAuthorizerHandlerV2 } from 'aws-lambda'
import { AuthorizerWrapperParams } from './authorizer-wrapper-params.interface'

export type AuthorizerWrapper = (
  params: AuthorizerWrapperParams
) => APIGatewayRequestIAMAuthorizerHandlerV2
