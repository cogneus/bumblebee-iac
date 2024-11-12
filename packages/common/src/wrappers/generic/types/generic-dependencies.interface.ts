import { ServiceContext } from '../../../types'

export interface GenericDependencies<TEvent> {
  event: TEvent
  serviceContext: ServiceContext
}
