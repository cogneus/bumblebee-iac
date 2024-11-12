import { IDBClient, ISMClient, ISecretsClient } from '..'
import { Destroyable } from './destroyable.interface'

export type ClientNames = 'ssm' | 'db' | 'secrets'

export interface Clients extends Partial<Record<ClientNames, Destroyable | undefined>> {
  db?: IDBClient
  secrets?: ISecretsClient
  ssm?: ISMClient
}
