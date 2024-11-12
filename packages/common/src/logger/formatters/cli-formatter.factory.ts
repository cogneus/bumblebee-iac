import { FormatterFactoryInput, FormatterFactory, TransformerInput } from '../types'

export const cliFormatter: FormatterFactory<FormatterFactoryInput, TransformerInput> =
  ({ processor }: FormatterFactoryInput) =>
  ({ level, eventCode, message, scope, src, eventData }) =>
    `[${new Date().toISOString()}] ${level.toUpperCase()}: ${
      eventCode ? `${eventCode} ` : ''
    }${message}\n ${JSON.stringify(
      {
        src,
        ...scope,
        ...eventData,
      },
      processor,
      2
    )}`
