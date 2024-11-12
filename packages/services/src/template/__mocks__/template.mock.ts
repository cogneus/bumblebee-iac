import { DBTemplateItem, TemplateItem, TemplateVersion } from '../../types'
import { NIL as emptyId } from 'uuid'

export const templateItem: TemplateItem = {
  group: 'mock-group',
  source: 'mock-source',
  target: 'mock-target',
  template: {},
}

export const templateVersion: TemplateVersion = {
  ...templateItem,
  id: emptyId,
  version: 1,
  created: '2023-01-01T00:00:00Z',
  modified: '2023-01-01T00:00:00Z',
}

export const dbTemplateItem: DBTemplateItem = {
  PK: 'mock-PK',
  SK: 'mock-SK',
  PKGSI: 'mock-PKGSI',
  SKGSI: 'mock-SKGSI',
  ...templateVersion,
}
