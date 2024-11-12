import { NamedRef } from '../../../types'
import { Destroyable } from '../../types'

export interface ISecretsClient extends Destroyable {
  readonly prefix: string
  readonly idPrefix: string
  readonly names: Record<string, NamedRef>
  readonly ids: Record<string, NamedRef>
  ensure: (name: string, value: any) => Promise<void>
  getValue: (id: string) => Promise<string | undefined>
  setValue: (name: string, value: any) => Promise<void>
}
