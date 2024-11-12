import { ServiceContext } from '../../../types'
import { StateMachinePayload } from './state-machine-payload.interface'

export interface StateMachineDependencies<T extends StateMachinePayload> {
  payload: T
  serviceContext: ServiceContext
}
