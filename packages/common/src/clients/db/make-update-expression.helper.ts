import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

export const makeUpdateExpression = (
  attributes: Record<string, any>
): Partial<UpdateCommandInput> => {
  const { expressions, names, values } = Object.entries(attributes).reduce(
    ({ expressions, names, values }, [key, value]) => {
      const nameRef = `#${key}`
      const valueRef = `:${key}`

      return {
        expressions: [...expressions, `${nameRef} = ${valueRef}`],
        values: {
          ...values,
          [valueRef]: value ?? null,
        },
        names: {
          ...names,
          [nameRef]: key,
        },
      }
    },
    {
      expressions: [],
      values: {},
      names: {},
    }
  )

  return {
    UpdateExpression: `SET ${expressions.join(', ')}`,
    ExpressionAttributeValues: values,
    ExpressionAttributeNames: names,
  }
}
