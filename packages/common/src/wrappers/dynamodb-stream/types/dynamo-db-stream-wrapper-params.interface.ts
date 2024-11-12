import type { DynamoDBRecord } from 'aws-lambda'
import { ClientOptions } from '../../../clients'
import { DynamoDBRecordHandler } from './dynamo-db-recordhandler.type'
import { ServiceContext } from '../../../types'
import { WrapperParams } from '../../types'

export interface DynamoDBStreamWrapperParams<TItem>
  extends WrapperParams<DynamoDBRecordHandler<TItem>, (record: DynamoDBRecord) => ClientOptions> {}

export interface DynamoDBStreamHandlerParams<TItem> extends DynamoDBStreamWrapperParams<TItem> {
  record: DynamoDBRecord
  context: ServiceContext
}
