import { Handler } from 'aws-lambda'
import { GenericWrapperParams } from './generic-wrapper-params.interface'

export type GenericWrapper = <TEvent, TResult>(
  params: GenericWrapperParams<TEvent, TResult>
) => Handler<TEvent, TResult>
