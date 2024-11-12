import 'source-map-support/register'
import { DynamoDBStreamWrapper, DynamoDBStreamWrapperParams } from './types'
import { ServiceContext } from '../../types'
import { handleRecord } from './handle-record'

export const dynamoDBStreamWrapper: DynamoDBStreamWrapper =
  <TItem>(params: DynamoDBStreamWrapperParams<TItem>) =>
  async (event, context: ServiceContext) => {
    if (event.Records?.length) {
      for (const record of event.Records) {
        await handleRecord({
          ...params,
          record,
          context,
        })
      }
    }
  }
