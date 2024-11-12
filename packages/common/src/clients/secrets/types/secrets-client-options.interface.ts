import { NamedRef } from '../../../types'

export interface SecretsClientOptions {
  prefix: string
  idPrefix: string
  names: Record<string, NamedRef>
  ids: Record<string, NamedRef>
  kmsId: string
}
