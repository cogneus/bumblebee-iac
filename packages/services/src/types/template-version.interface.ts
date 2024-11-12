import { TemplateItem } from './template-item.interface'

export interface TemplateVersion extends TemplateItem {
  id: string
  version: number
  created: string
  modified: string
}
