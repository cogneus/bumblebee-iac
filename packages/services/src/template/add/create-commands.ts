import { TransactItem } from 'bumblebee-common'
import { TemplateVersion } from '../../types'
import { makePK, makePKGSIGroup, makeSK, makeSKCurrent, makeSKGSIModified } from '../helpers'

export const createCommands = (template: TemplateVersion, tableName: string): TransactItem[] => [
  {
    Put: {
      TableName: tableName,
      Item: {
        ...template,
        PK: makePK(template),
        SK: makeSKCurrent(),
        PKGSI: makePKGSIGroup(template),
        SKGSI: makeSKGSIModified(template),
      },
      ConditionExpression: 'attribute_not_exists(#pk) and attribute_not_exists(#sk)',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
    },
  },
  {
    Put: {
      TableName: tableName,
      Item: {
        ...template,
        PK: makePK(template),
        SK: makeSK(template),
        PKGSI: makePK(template),
        SKGSI: makeSKGSIModified(template),
      },
      ConditionExpression: 'attribute_not_exists(#pk) and attribute_not_exists(#sk)',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
    },
  },
]
