import { TableConfig, getRecordLimit } from 'bumblebee-common'
import { ListParams } from '../../types'

export const getVersionParams = (tableConfig: TableConfig, params?: ListParams): ListParams => {
  const { sort, cursor, limit, includeCurrent, fields } = params || {}
  return {
    limit: getRecordLimit(tableConfig, limit),
    sort: sort || 'asc',
    cursor,
    includeCurrent,
    fields,
  }
}
