import { ClientOptions } from '../../../clients'
import { WrapperParams } from '../../types'
import { GenericHandler } from './generic-handler.type'

export interface GenericWrapperParams<TEvent, TResult>
  extends WrapperParams<GenericHandler<TEvent, TResult>, () => ClientOptions> {}
