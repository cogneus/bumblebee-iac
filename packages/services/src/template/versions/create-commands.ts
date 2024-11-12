import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { ListParams } from '../../types'
import { FilterInput, makePK, prefixSK } from '../helpers'

export const createCommands = (
  id: string,
  { sort, includeCurrent, fields }: ListParams,
  tableName: string
): QueryCommandInput => {
  const filterInput = new FilterInput()
    .addKeyCondition('PK', makePK({ id }))
    .addKeyCondition('SK', !includeCurrent ? prefixSK : undefined, 'begins_with')
    .toQueryInput()

  return {
    TableName: tableName,
    ProjectionExpression: fields?.join(', '),
    ScanIndexForward: sort === 'asc',
    ...filterInput,
  }
}
