import { GetCommandInput } from '@aws-sdk/lib-dynamodb'
import { makePK, makeSK, makeSKCurrent } from '../helpers'

export const createCommands = (
  id: string,
  version: number | undefined,
  tableName: string
): GetCommandInput => {
  const SK = version ? makeSK({ version }) : makeSKCurrent()
  return {
    TableName: tableName,
    Key: {
      PK: makePK({ id }),
      SK,
    },
  }
}
