import { IDBClient, PagedItems, ServiceContext, ensureClient } from 'bumblebee-common'
import { TemplateVersion, DBTemplateItem, QueryParams } from '../../types'
import { removeKeyInfo } from '../helpers'
import { MissingAttributes } from '../../exceptions'
import { createCommands } from './create-commands'
import { getQueryParams } from './get-query-params'

export const queryTemplates = async <T = TemplateVersion>(
  context: ServiceContext,
  group: string,
  params?: QueryParams
): Promise<PagedItems<T>> => {
  if (!group) {
    throw MissingAttributes(['group'])
  }
  const db = ensureClient<IDBClient>(context, 'db')
  const table = db.tables.templates
  const queryParams = getQueryParams(table, params)
  const { cursor, limit } = queryParams
  const input = createCommands(group, queryParams, table.name, table.indices.groups.name)
  const { items, cursor: nextCursor } = await db.query<DBTemplateItem>(input, limit, cursor)

  return {
    cursor: nextCursor,
    items: (queryParams.fields?.length ? items : items.map(removeKeyInfo)) as T[],
  }
}
