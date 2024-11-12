import { StateMachineDependencies } from './state-machine-dependencies.interface'
import { StateMachinePayload } from './state-machine-payload.interface'

export type StateMachineHandler<TInput extends StateMachinePayload, TResult> = (
  args: StateMachineDependencies<TInput>
) => Promise<TResult>
