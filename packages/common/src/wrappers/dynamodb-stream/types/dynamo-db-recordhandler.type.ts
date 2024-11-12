import { DynamoDBStreamDependencies } from './dynamo-db-stream-dependencies.interface'

export type DynamoDBRecordHandler<TItem> = (
  args: DynamoDBStreamDependencies<TItem>
) => Promise<void>
