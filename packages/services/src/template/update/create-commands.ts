import { TransactItem, makeUpdateExpression } from 'bumblebee-common'
import { TemplateVersion } from '../../types'
import { makePK, makePKGSIGroup, makeSK, makeSKCurrent, makeSKGSIModified } from '../helpers'

export const createCommands = (template: TemplateVersion, tableName: string): TransactItem[] => {
  const updateExpression = makeUpdateExpression({
    ...template,
    PKGSI: makePKGSIGroup(template),
    SKGSI: makeSKGSIModified(template),
  })
  return [
    {
      Update: {
        ...updateExpression,
        TableName: tableName,
        Key: {
          PK: makePK(template),
          SK: makeSKCurrent(),
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
}