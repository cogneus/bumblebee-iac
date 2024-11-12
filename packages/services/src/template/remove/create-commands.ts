import { DBItemPrimaryBase } from '../../types'
import { TransactItem } from 'bumblebee-common'

export const createCommands = (keys: DBItemPrimaryBase[], tableName: string): TransactItem[] =>
  keys.map(
    (key) =>
      ({
        Delete: {
          TableName: tableName,
          Key: key,
        },
      }) as TransactItem
  )
