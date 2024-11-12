import type { SQSRecord } from 'aws-lambda'

export type SQSMessageParser<TMessage = any> = (record: SQSRecord) => TMessage
