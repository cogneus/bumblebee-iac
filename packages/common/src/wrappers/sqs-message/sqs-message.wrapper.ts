import 'source-map-support/register'
import type { SQSBatchItemFailure } from 'aws-lambda'
import { ServiceContext } from '../../types'
import { SQSMessageWrapper } from './types'
import { handleRecord } from './handle-record'

export const sqsMessageWrapper: SQSMessageWrapper =
  (params) => async (event, context: ServiceContext) => {
    const { enabled } = params
    if (!enabled) {
      return { batchItemFailures: [] }
    }
    const { Records } = event
    const results = await Promise.all(
      Records.map((record) => handleRecord({ ...params, record, context }))
    )
    const batchItemFailures: SQSBatchItemFailure[] = results
      .filter(({ success }) => !success)
      .map(({ messageId: itemIdentifier }) => ({
        itemIdentifier,
      }))

    return { batchItemFailures }
  }
