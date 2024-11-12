import { ServiceContext, ensureClient, IDBClient } from 'bumblebee-common'
import { TemplateItem, TemplateVersion } from '../../types'
import { validateTemplate } from '../helpers'
import { createCommands } from './create-commands'
import { generateId } from '../helpers'

export const addTemplate = async (
  context: ServiceContext,
  template: TemplateItem
): Promise<TemplateVersion> => {
  validateTemplate(template)

  const db = ensureClient<IDBClient>(context, 'db')
  const date = new Date().toISOString()
  const newVersion: TemplateVersion = {
    ...template,
    id: generateId(),
    version: 1,
    modified: date,
    created: date,
  }
  const params = createCommands(newVersion, db.tables.templates.name)
  await db.transactWrite(params)
  return newVersion
}
