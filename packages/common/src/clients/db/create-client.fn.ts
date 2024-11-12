import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { NodeHttpHandler } from '@aws-sdk/node-http-handler'
import { DynamoDBDocumentClient, TranslateConfig } from '@aws-sdk/lib-dynamodb'
import {
  marshallOptions as MarshallOptions,
  unmarshallOptions as UnmarshallOptions,
} from '@aws-sdk/util-dynamodb'
import { DBClientOptions } from './types'

const marshallOptions: MarshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
}

const unmarshallOptions: UnmarshallOptions = {
  wrapNumbers: false,
}

const translateConfig: TranslateConfig = {
  marshallOptions,
  unmarshallOptions,
}

export const createClient = ({ maxAttempts, requestTimeout }: DBClientOptions) => {
  const requestHandler = new NodeHttpHandler({
    connectionTimeout: requestTimeout,
    socketTimeout: requestTimeout,
  }) as any
  const client = new DynamoDBClient({
    maxAttempts,
    requestHandler,
  })
  return DynamoDBDocumentClient.from(client, translateConfig)
}
