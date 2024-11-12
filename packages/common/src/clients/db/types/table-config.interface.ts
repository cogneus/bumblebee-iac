import { NamedRef } from '../../../types'

export interface TableConfig extends NamedRef {
  indices: Record<string, NamedRef>
  itemLimits: {
    defaultLimit: number
    maxLimit: number
  }
}
