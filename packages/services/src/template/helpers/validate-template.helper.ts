import { EmptyRequest, MissingAttributes } from '../../exceptions'
import { TemplateItem } from '../../types'

export const mandatoryKeys = ['group', 'source', 'target', 'template']

export const validateTemplate = (templateItem: TemplateItem | undefined | null) => {
  if (!templateItem) {
    throw EmptyRequest()
  }

  const missing = mandatoryKeys.filter((key) => {
    const value = templateItem[key]
    return (
      value === null || value === undefined || (typeof value === 'string' && value.length === 0)
    )
  })
  if (missing.length) {
    throw MissingAttributes(missing)
  }
}
