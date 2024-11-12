import { SQSMessageHandlerParams, SQSMessageHandlerResponse } from './types'
import { applyWrapperClients, createWrapperContext } from '../utils'
import { handleError } from './handle-error'
import { destroyClients } from '../../clients'

export const handleRecord = async <TMessage>({
  record,
  context,
  handler,
  parse,
  getClientOptions,
  errorActions,
  ...contextParams
}: SQSMessageHandlerParams<TMessage>): Promise<SQSMessageHandlerResponse> => {
  const serviceContext = createWrapperContext({
    ...contextParams,
    context,
    logInfo: { record },
  })
  const { log } = serviceContext
  const { messageId } = record
  try {
    const message = parse(record)
    applyWrapperClients(getClientOptions(message, record), serviceContext)
    const result = await handler({
      serviceContext,
      message,
      messageId,
    })
    log.debug('Process complete', result)
    return result
  } catch (ex) {
    return handleError(ex, log, messageId, errorActions)
  } finally {
    destroyClients(serviceContext.clients)
  }
}
