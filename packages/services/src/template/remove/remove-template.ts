import { IDBClient, ServiceContext, ensureClient } from 'bumblebee-common'
import { getTemplate } from '../get/get-template'
import { MissingAttributes } from '../../exceptions'
import { createCommands } from './create-commands'
import { templateVersions } from '../versions'
import { DBItemPrimaryBase } from '../../types'

export const removeTemplate = async (context: ServiceContext, id: string): Promise<void> => {
  if (!id) {
    throw MissingAttributes(['id'])
  }
  await getTemplate(context, id)
  const db = ensureClient<IDBClient>(context, 'db')
  let nextCursor: string | undefined
  do {
    const { cursor, items } = await templateVersions<DBItemPrimaryBase>(context, id, {
      cursor: nextCursor,
      includeCurrent: true,
      fields: ['PK', 'SK'],
      limit: 20,
    })
    const params = createCommands(items, db.tables.templates.name)
    await db.transactWrite(params)
    nextCursor = cursor
  } while (nextCursor)
}
