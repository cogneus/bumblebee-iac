import { ServiceContext } from '../../../types'

export interface ApiGatewayDependencies<TPayload, TParams> {
  payload: TPayload
  params: TParams
  serviceContext: ServiceContext
}
