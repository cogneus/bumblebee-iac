import { ServiceContext } from '../../../types'

export type DynamoDBEventName = 'INSERT' | 'MODIFY' | 'REMOVE' | undefined
export interface DynamoDBStreamDependencies<TItem> {
  item: TItem | null
  serviceContext: ServiceContext
  eventName: DynamoDBEventName
}
