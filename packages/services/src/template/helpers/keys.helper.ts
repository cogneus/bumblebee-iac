import { DBTemplateItem, TemplateVersion } from '../../types'

export const prefixPK = 'template'
export const prefixSK = 'version'
export const prefixGroup = 'group'
export const prefixModified = 'modified'
export const prefixCurrent = 'current'

export const makePK = ({ id }: { id: string }) => `${prefixPK}#${id}`

export const makeSK = ({ version }: { version: number }) =>
  `${prefixSK}#${version.toString().padStart(10, '0')}`

export const makePKGSIGroup = ({ group }: { group: string }) => `${prefixGroup}#${group}`

export const makeSKGSIModified = ({ modified }: TemplateVersion) => `${prefixModified}#${modified}`

export const makeSKCurrent = () => `${prefixCurrent}`

const keyAttrs = ['PK', 'SK', 'PKGSI', 'SKGSI']

export const removeKeyInfo = (dbItem: DBTemplateItem): TemplateVersion =>
  Object.keys(dbItem).reduce<TemplateVersion>(
    (item, key) =>
      keyAttrs.includes(key)
        ? item
        : {
            ...item,
            [key]: dbItem[key],
          },
    {} as TemplateVersion
  )
