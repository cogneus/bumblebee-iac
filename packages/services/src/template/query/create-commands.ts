import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { QueryParams } from '../../types'
import { FilterInput, makePKGSIGroup } from '../helpers'

export const createCommands = (
  group: string,
  { sort, source, target, fields }: QueryParams,
  tableName: string,
  indexName: string
): QueryCommandInput => {
  const filterInput = new FilterInput()
    .addKeyCondition('PKGSI', makePKGSIGroup({ group }))
    .addFilter('target', target)
    .addFilter('source', source)
    .toQueryInput()

  return {
    TableName: tableName,
    IndexName: indexName,
    ProjectionExpression: fields?.join(', '),
    ScanIndexForward: sort === 'asc',
    ...filterInput,
  }
}
