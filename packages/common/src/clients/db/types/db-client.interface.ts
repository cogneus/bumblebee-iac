import {
  PutCommandInput,
  PutCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput,
  DeleteCommandInput,
  DeleteCommandOutput,
  GetCommandInput,
  QueryCommandInput,
  TransactWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { TableConfig } from './table-config.interface'
import { PagedItems } from './paged-items.interface'
import { TransactItem } from './transact-item.interface'
import { Destroyable } from '../../types'

export interface IDBClient extends Destroyable {
  readonly tables: Record<string, TableConfig>
  put: (params: PutCommandInput) => Promise<PutCommandOutput>
  update: (params: UpdateCommandInput) => Promise<UpdateCommandOutput>
  delete: (params: DeleteCommandInput) => Promise<DeleteCommandOutput>
  get: <T>(params: GetCommandInput) => Promise<T>
  query: <T>(params: QueryCommandInput, limit?: number, cursor?: string) => Promise<PagedItems<T>>
  queryAll: <T>(request: QueryCommandInput) => Promise<T[]>
  transactWrite: (transactions: TransactItem[]) => Promise<TransactWriteCommandOutput>
}
