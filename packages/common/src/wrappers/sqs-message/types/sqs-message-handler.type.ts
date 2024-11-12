import { SQSMessageDependencies } from './sqs-message-dependencies.interface'
import { SQSMessageHandlerResponse } from './sqs-message-handler-response.interface'

export type SQSMessageHandler<TMessage = any> = (
  args: SQSMessageDependencies<TMessage>
) => Promise<SQSMessageHandlerResponse>
