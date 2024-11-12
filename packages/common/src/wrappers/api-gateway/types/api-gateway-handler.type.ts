import { ApiGatewayDependencies } from './api-gateway-dependencies.interface'

export type APIGatewayHandler<TPayload, TParams, TResult> = (
  args: ApiGatewayDependencies<TPayload, TParams>
) => Promise<TResult>
