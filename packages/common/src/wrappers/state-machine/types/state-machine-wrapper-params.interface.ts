import { ClientOptions } from '../../../clients'
import { StateMachinePayload } from './state-machine-payload.interface'
import { StateMachineHandler } from './state-machine-handler.type'
import { WrapperParams } from '../../types'

export interface StateMachineWrapperParams<TInput extends StateMachinePayload, TResult>
  extends WrapperParams<StateMachineHandler<TInput, TResult>, (payload: TInput) => ClientOptions> {}
