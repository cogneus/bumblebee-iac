import { ServiceContext } from '../../../types'

export interface SQSMessageDependencies<TMessage> {
  message: TMessage
  messageId: string
  serviceContext: ServiceContext
}
