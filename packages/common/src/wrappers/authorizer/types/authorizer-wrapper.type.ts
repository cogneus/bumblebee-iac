import { APIGatewayRequestIAMAuthorizerHandlerV2, APIGatewayRequestSimpleAuthorizerHandlerV2 } from 'aws-lambda'
import { AuthorizerWrapperParams } from './authorizer-wrapper-params.interface'

export type IamAuthorizerWrapper = (
  params: AuthorizerWrapperParams
) => APIGatewayRequestIAMAuthorizerHandlerV2

export type SimpleAuthorizerWrapper = (
  params: AuthorizerWrapperParams
) => APIGatewayRequestSimpleAuthorizerHandlerV2
