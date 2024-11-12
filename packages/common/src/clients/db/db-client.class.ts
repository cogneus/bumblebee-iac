import {
  DynamoDBDocumentClient,
  DynamoDBDocumentClientCommand,
  ServiceInputTypes,
  ServiceOutputTypes,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  GetCommand,
  GetCommandInput,
  QueryCommand,
  QueryCommandInput,
  paginateQuery,
  TransactWriteCommandOutput,
  TransactWriteCommand,
  GetCommandOutput,
  QueryCommandOutput,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { createClient } from './create-client.fn'
import { TableConfig, DBClientOptions, PagedItems, TransactItem } from './types'
import { fromBase64, toBase64 } from './base64-conversion'
import { Logger } from '../../logger'
import { ServiceContext } from '../../types'

export class DBClient {
  public readonly tables: Record<string, TableConfig>
  private client: DynamoDBDocumentClient
  private log: Logger

  constructor(options: DBClientOptions, context: ServiceContext) {
    const { tables } = options
    this.tables = tables
    this.log = context.log.getScopedLogger({ name: 'DBClient' })
    this.client = createClient(options)
  }

  public async put(input: PutCommandInput): Promise<PutCommandOutput> {
    return this.sendRequest<PutCommandInput, PutCommandOutput>(new PutCommand(input))
  }

  public async update(input: UpdateCommandInput): Promise<UpdateCommandOutput> {
    return this.sendRequest<UpdateCommandInput, UpdateCommandOutput>(new UpdateCommand(input))
  }

  public async delete(input: DeleteCommandInput): Promise<DeleteCommandOutput> {
    return this.sendRequest<DeleteCommandInput, DeleteCommandOutput>(new DeleteCommand(input))
  }

  public async get<T>(input: GetCommandInput): Promise<T> {
    const { Item } = await this.sendRequest<GetCommandInput, GetCommandOutput>(
      new GetCommand(input)
    )
    return Item as T
  }

  public async query<T>(
    input: QueryCommandInput,
    limit?: number,
    cursor?: string
  ): Promise<PagedItems<T>> {
    const startKey = fromBase64(cursor)
    const { Items, LastEvaluatedKey } = await this.sendRequest<
      QueryCommandInput,
      QueryCommandOutput
    >(
      new QueryCommand({
        ...input,
        Limit: limit ?? input.Limit,
        ExclusiveStartKey: startKey,
      })
    )

    return {
      items: (Items as T[]) || [],
      cursor: toBase64(LastEvaluatedKey),
    }
  }

  public async queryAll<T>(input: QueryCommandInput): Promise<T[]> {
    let items: T[] = []
    for await (const page of paginateQuery({ client: this.client }, input)) {
      items = [...items, ...(page.Items as unknown as T[])]
    }
    return items
  }

  public async transactWrite(transactions: TransactItem[]): Promise<TransactWriteCommandOutput> {
    return this.sendRequest<TransactWriteCommandInput, TransactWriteCommandOutput>(
      new TransactWriteCommand({
        TransactItems: transactions as any,
      })
    )
  }

  public destroy() {
    this.client?.destroy()
  }

  private async sendRequest<TInput extends ServiceInputTypes, TOutput extends ServiceOutputTypes>(
    command: DynamoDBDocumentClientCommand<TInput, TOutput, any, any, any>
  ) {
    this.log.debug('Sending DB request', command.input)
    return this.client.send(command)
  }
}
