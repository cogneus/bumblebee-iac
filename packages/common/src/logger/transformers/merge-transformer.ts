import { Transformer, FactoryWithInput } from '../types'

export interface MergeTransformerFactoryInput {
  transformers: Transformer[]
}

export const mergeTransformer: FactoryWithInput<Transformer, MergeTransformerFactoryInput> =
  ({ transformers }) =>
  (data, entry?) =>
    transformers.reduce((value, transformer) => transformer(data, value), entry || {})
