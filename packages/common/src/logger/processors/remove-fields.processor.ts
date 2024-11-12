import { JsonProcessor, FactoryWithInput } from '../types'

export interface RemoveFieldsProcessorFactoryInput {
  ignoreFields?: string[]
}

export const removeFields: FactoryWithInput<
  JsonProcessor | undefined,
  RemoveFieldsProcessorFactoryInput
> = ({ ignoreFields }) =>
  ignoreFields
    ? (key: string, value: unknown) =>
        ignoreFields.includes(key.toLowerCase()) ? undefined : value
    : undefined
