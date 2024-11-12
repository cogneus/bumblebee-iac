import type { SQSHandler } from 'aws-lambda'
import { SQSMessageWrapperParams } from './sqs-message-wrapper-params.interface'

export type SQSMessageWrapper = <TMessage>(params: SQSMessageWrapperParams<TMessage>) => SQSHandler
