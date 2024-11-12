import { TableConfig, getRecordLimit } from 'bumblebee-common'
import { QueryParams } from '../../types'

export const getQueryParams = (tableConfig: TableConfig, params?: QueryParams): QueryParams => {
  const { sort, cursor, limit, source, target, fields } = params || {}
  return {
    limit: getRecordLimit(tableConfig, limit),
    sort: sort || 'asc',
    cursor,
    source,
    target,
    fields,
  }
}
