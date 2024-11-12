import { ErrorActionCollection, SQSMessageHandlerResponse } from './types'
import { Logger } from '../../logger'

export const handleError = (
  e: any,
  logger: Logger,
  messageId: string,
  errorActions?: ErrorActionCollection
): SQSMessageHandlerResponse => {
  const action = errorActions?.[e.code] || 'unknown'
  if (action !== 'ignore') {
    logger.warn(`Process failed, ${e.message}`)
    logger.error(e)
  }
  return {
    messageId,
    success: ['ignore', 'no-retry'].includes(action),
  }
}
