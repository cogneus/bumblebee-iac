import 'source-map-support/register'
import { ServiceContext } from '../../types'
import { createWrapperContext } from '../utils'
import { GenericWrapper } from './types'
import { destroyClients } from '../../clients'

export const genericWrapper: GenericWrapper =
  ({ handler, getClientOptions, ...contextParams }) =>
  async (event, context: ServiceContext) => {
    const serviceContext = createWrapperContext({
      ...contextParams,
      context,
      logInfo: {
        event,
      },
      clientOptions: getClientOptions(),
    })
    const { log } = serviceContext

    try {
      log.debug('Process input', event as any)

      const result = await handler({
        event,
        serviceContext,
      })

      log.debug('Process complete', result as any)
      return result
    } catch (ex) {
      log.warn(`Process failed, ${ex.message}`)
      log.error(ex)
      throw ex
    } finally {
      destroyClients(serviceContext.clients)
    }
  }
