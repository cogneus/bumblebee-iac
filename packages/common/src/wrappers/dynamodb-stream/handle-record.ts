import { unmarshall } from '@aws-sdk/util-dynamodb'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { DynamoDBStreamHandlerParams } from './types'
import { createWrapperContext } from '../utils'
import { destroyClients } from '../../clients'

export const handleRecord = async <TItem>({
  record,
  serviceName,
  region,
  env,
  logName,
  logLevel,
  context,
  handler,
  getClientOptions,
}: DynamoDBStreamHandlerParams<TItem>) => {
  const serviceContext = createWrapperContext({
    context,
    serviceName,
    region,
    env,
    logName,
    logLevel,
    logInfo: { record },
    clientOptions: getClientOptions(record),
  })
  const { log } = serviceContext
  try {
    const { eventName, dynamodb: { NewImage } = {} } = record
    const item = NewImage
      ? (unmarshall(NewImage as { [key: string]: AttributeValue }) as TItem)
      : null
    await handler({
      serviceContext,
      item,
      eventName,
    })
    log.debug('Process complete')
  } catch (ex) {
    log.warn(`Process failed, ${ex.message}`)
    log.error(ex)
  } finally {
    destroyClients(serviceContext.clients)
  }
}
