import { IDBClient, ServiceContext, ensureClient } from 'bumblebee-common'
import { TemplateVersion, DBTemplateItem } from '../../types'
import { removeKeyInfo } from '../helpers'
import { MissingAttributes, TemplateNotFound } from '../../exceptions'
import { createCommands } from './create-commands'

export const getTemplate = async (
  context: ServiceContext,
  id: string,
  version?: number
): Promise<TemplateVersion> => {
  if (!id) {
    throw MissingAttributes(['id'])
  }
  const db = ensureClient<IDBClient>(context, 'db')
  const params = createCommands(id, version, db.tables.templates.name)
  const dbItem = await db.get<DBTemplateItem>(params)

  if (dbItem) {
    return removeKeyInfo(dbItem)
  }

  throw TemplateNotFound(id)
}
