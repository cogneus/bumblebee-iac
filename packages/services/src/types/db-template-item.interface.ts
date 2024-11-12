import { DBItemBase } from './db-item-base.interface'
import { TemplateVersion } from './template-version.interface'

export interface DBTemplateItem extends DBItemBase, TemplateVersion {}
