import { IDBClient, PagedItems, ServiceContext, ensureClient } from 'bumblebee-common'
import { TemplateVersion, DBTemplateItem, ListParams } from '../../types'
import { removeKeyInfo } from '../helpers'
import { MissingAttributes } from '../../exceptions'
import { createCommands } from './create-commands'
import { getVersionParams } from './get-version-params'

export const templateVersions = async <T = TemplateVersion>(
  context: ServiceContext,
  id: string,
  params?: ListParams
): Promise<PagedItems<T>> => {
  if (!id) {
    throw MissingAttributes(['id'])
  }
  const db = ensureClient<IDBClient>(context, 'db')
  const table = db.tables.templates
  const listParams = getVersionParams(table, params)
  const { cursor, limit } = listParams
  const input = createCommands(id, listParams, table.name)
  const { items, cursor: nextCursor } = await db.query<DBTemplateItem>(input, limit, cursor)

  return {
    cursor: nextCursor,
    items: (listParams.fields?.length ? items : items.map(removeKeyInfo)) as T[],
  }
}
