import { ServiceContext } from '../../../types'

export type APIGatewayAuthChecker<TToken> = (
  token: TToken,
  serviceContext: ServiceContext
) => boolean
