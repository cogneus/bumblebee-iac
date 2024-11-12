import { NamedRef } from '../../../types'
import { Destroyable } from '../../types'

export interface ISMClient extends Destroyable {
  readonly prefix: string
  readonly names: Record<string, NamedRef>
  getValue: (name: string) => Promise<string | undefined>
  setValue: (name: string, value: string, type?: string) => Promise<void>
}
