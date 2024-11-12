import { TableConfig } from './table-config.interface'

export interface DBClientOptions {
  region: string
  maxAttempts: number
  requestTimeout: number
  tables: Record<string, TableConfig>
}
