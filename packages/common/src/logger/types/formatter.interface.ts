import { JsonProcessor } from './json-processor.intreface'

export type OutputStyle = 'raw' | 'pretty'
export type FormatterFactoryInput = {
  style?: OutputStyle
  processor?: JsonProcessor
}

export type Formatter<TData = Record<string, any>> = (input: TData) => string

export type FormatterFactory<
  TInput extends FormatterFactoryInput = FormatterFactoryInput,
  TData = Record<string, any>,
> = (input: TInput) => Formatter<TData>
