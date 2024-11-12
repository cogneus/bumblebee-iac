import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'

export type Operator = 'begins_with' | 'equals'
const exprJoin = ' and '

const arrayValues = (array: string[], key: string): Partial<QueryCommandInput> =>
  array.length ? { [key]: array.join(exprJoin) } : {}

const makeExpression = (name: string, value: string, operator: Operator): string => {
  switch (operator) {
    case 'begins_with':
      return `begins_with(${name}, ${value})`
    default:
      return `(${name} = ${value})`
  }
}

export class FilterInput {
  private names: Record<string, string> = {}
  private values: Record<string, string> = {}
  private keyConditions: string[] = []
  private filters: string[] = []

  public addFilter(
    name: string,
    value: string | undefined,
    operator: Operator = 'equals'
  ): FilterInput {
    return this.add(name, value, operator, this.filters)
  }

  public addKeyCondition(
    name: string,
    value: string | undefined,
    operator: Operator = 'equals'
  ): FilterInput {
    return this.add(name, value, operator, this.keyConditions)
  }

  public toQueryInput(): Partial<QueryCommandInput> {
    return Object.keys(this.names).length
      ? {
          ExpressionAttributeNames: this.names,
          ExpressionAttributeValues: this.values,
          ...arrayValues(this.keyConditions, 'KeyConditionExpression'),
          ...arrayValues(this.filters, 'FilterExpression'),
        }
      : {}
  }

  private add(
    name: string,
    value: string | undefined,
    operator: Operator = 'equals',
    array: string[]
  ): FilterInput {
    if (value) {
      const nameKey = `#${name}`
      const valueKey = `:${name}`
      this.names[nameKey] = name
      this.values[valueKey] = value
      array.push(makeExpression(nameKey, valueKey, operator))
    }
    return this
  }
}
