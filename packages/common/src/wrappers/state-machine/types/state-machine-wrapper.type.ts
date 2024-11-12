import { Handler } from 'aws-lambda'
import { StateMachinePayload } from './state-machine-payload.interface'
import { StateMachineInput } from './state-machine-input.interface'
import { StateMachineWrapperParams } from './state-machine-wrapper-params.interface'

export type StateMachineWrapper = <TInput extends StateMachinePayload, TResult>(
  params: StateMachineWrapperParams<TInput, TResult>
) => Handler<StateMachineInput<TInput>, TResult>
