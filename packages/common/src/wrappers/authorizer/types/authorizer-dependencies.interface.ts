import { ServiceContext } from '../../../types'
import { APIGatewayInfo } from './api-gateway-info.interface'

export interface AuthorizerDependencies {
  apiInfo: APIGatewayInfo
  serviceContext: ServiceContext
  token: string
}
