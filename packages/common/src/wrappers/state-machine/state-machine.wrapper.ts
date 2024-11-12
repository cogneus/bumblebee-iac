import 'source-map-support/register'
import { ServiceContext } from '../../types'
import { createWrapperContext } from '../utils'
import { StateMachineWrapper } from './types'
import { destroyClients } from '../../clients'

export const stateMachineWrapper: StateMachineWrapper =
  ({ handler, getClientOptions, ...contextParams }) =>
  async (event, context: ServiceContext) => {
    const { payload } = event
    const serviceContext = createWrapperContext({
      ...contextParams,
      context,
      logInfo: {
        payload,
      },
      clientOptions: getClientOptions(payload),
    })
    const { log } = serviceContext
    try {
      log.debug('Process input', event)
      const result = await handler({
        payload,
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
