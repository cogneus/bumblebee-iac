import type { DynamoDBStreamHandler } from 'aws-lambda'
import { DynamoDBStreamWrapperParams } from './dynamo-db-stream-wrapper-params.interface'

export type DynamoDBStreamWrapper = <TItem>(
  params: DynamoDBStreamWrapperParams<TItem>
) => DynamoDBStreamHandler
