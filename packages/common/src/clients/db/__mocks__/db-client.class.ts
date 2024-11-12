import { IDBClient, DBClientOptions, TableConfig } from '../types'

export class DBClientMock implements IDBClient {
  public readonly tables: Record<string, TableConfig>

  put = jest.fn()
  update = jest.fn()
  delete = jest.fn()
  get = jest.fn()
  query = jest.fn()
  queryAll = jest.fn()
  transactWrite = jest.fn()
  destroy = jest.fn()

  constructor({ tables }: DBClientOptions) {
    this.tables = tables
  }
}
