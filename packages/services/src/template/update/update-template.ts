import { ServiceContext, ensureClient, IDBClient } from 'bumblebee-common'
import { TemplateItem, TemplateVersion } from '../../types'
import { validateTemplate } from '../helpers'
import { getTemplate } from '../get/get-template'
import { createCommands } from './create-commands'

export const updateTemplate = async (
  context: ServiceContext,
  id: string,
  template: TemplateItem
): Promise<TemplateVersion> => {
  validateTemplate(template)
  const currentTemplate = await getTemplate(context, id)
  const { version, created } = currentTemplate
  const db = ensureClient<IDBClient>(context, 'db')
  const modified = new Date().toISOString()
  const newVersion: TemplateVersion = {
    ...template,
    id,
    version: version + 1,
    modified,
    created,
  }
  const params = createCommands(newVersion, db.tables.templates.name)
  await db.transactWrite(params)
  return newVersion
}
