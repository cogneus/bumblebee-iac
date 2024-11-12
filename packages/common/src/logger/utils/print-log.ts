import { Transformer, TransformerInput, Formatter } from '../types'

export type PrintInput<EventT = string> = {
  data: TransformerInput<EventT>
  formatter: Formatter
  transformer?: Transformer<EventT>
}

export const print = <EventT>({ data, transformer, formatter }: PrintInput<EventT>) => {
  const input = transformer ? transformer(data) : data
  process.stdout.write(`${formatter(input)}\n`)
}
