import { FormatterFactoryInput, Formatter, FormatterFactory } from '../types'

export const jsonFormatter: FormatterFactory = ({
  style,
  processor,
}: FormatterFactoryInput): Formatter => {
  if (!style) {
    style = 'raw'
  }

  const indent = style === 'pretty' ? 2 : undefined
  return (data) => JSON.stringify(data, processor, indent)
}
