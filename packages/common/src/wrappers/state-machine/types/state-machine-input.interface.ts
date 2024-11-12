import { StateMachinePayload } from './state-machine-payload.interface'

export interface StateMachineInput<T extends StateMachinePayload> {
  payload: T
}
