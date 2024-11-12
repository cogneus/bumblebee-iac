import { GenericDependencies } from './generic-dependencies.interface'

export type GenericHandler<TEvent, TResult> = (
  args: GenericDependencies<TEvent>
) => Promise<TResult>
