import { ServiceContext } from '../../types'
import { ClientOptions } from '../../clients'

export const applyWrapperClients = (clientOptions: ClientOptions, context: ServiceContext) => {
  context.clientOptions = clientOptions
}
