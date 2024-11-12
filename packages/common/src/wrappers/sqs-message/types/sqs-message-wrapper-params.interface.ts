import { SQSRecord } from 'aws-lambda'
import { ClientOptions } from '../../../clients'
import { SQSMessageHandler } from './sqs-message-handler.type'
import { SQSMessageParser } from './sqs-message-parser.type'
import { ErrorActionCollection } from './error-action-collection.type'
import { ServiceContext } from '../../../types'
import { WrapperParams } from '../../types'

export interface SQSMessageWrapperParams<TMessage>
  extends WrapperParams<
    SQSMessageHandler<TMessage>,
    (message: TMessage, record: SQSRecord) => ClientOptions
  > {
  parse: SQSMessageParser<TMessage>
  enabled?: boolean
  errorActions?: ErrorActionCollection
}

export interface SQSMessageHandlerParams<TMessage> extends SQSMessageWrapperParams<TMessage> {
  context: ServiceContext
  record: SQSRecord
}
