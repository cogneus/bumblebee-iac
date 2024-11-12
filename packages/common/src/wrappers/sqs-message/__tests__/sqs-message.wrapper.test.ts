import { SQSEvent, SQSRecord } from 'aws-lambda'
import { sqsMessageWrapper } from '../sqs-message.wrapper'
import { AppException, StatusCodes } from '../../../exceptions'
import { ErrorActionCollection } from '../types'
import { ClientOptions } from '../../../clients'

const InvalidArgumentRetry: AppException = {
  name: 'invalid-argument-retry',
  code: 'invalid-argument-retry',
  message: 'test exception retry',
  status: StatusCodes.BadRequest,
}

const InvalidArgumentIgnore: AppException = {
  name: 'invalid-argument-ignore',
  code: 'invalid-argument-ignore',
  message: 'test exception ignore',
  status: StatusCodes.BadRequest,
}

const errors: {
  error: AppException | Error
  messageId: any
}[] = [
  {
    error: InvalidArgumentRetry,
    messageId: 1,
  },
  {
    error: InvalidArgumentIgnore,
    messageId: 2,
  },
  {
    error: new Error('Generic error'),
    messageId: 3,
  },
]

const clientOptions: ClientOptions = {
  db: {
    maxAttempts: 3,
    region: 'eu-west-1',
    requestTimeout: 3000,
    tables: {
      test: {
        name: 'test-table-name',
        indices: {
          testIndex: { name: 'test-index-name' },
        },
        itemLimits: { defaultLimit: 20, maxLimit: 100 },
      },
    },
  },
}

export const errorActions: ErrorActionCollection = {
  [InvalidArgumentRetry.code]: 'no-retry',
  [InvalidArgumentIgnore.code]: 'ignore',
}

const baseRecord: SQSRecord = {
  attributes: {
    ApproximateFirstReceiveTimestamp: '',
    ApproximateReceiveCount: '',
    SenderId: '',
    SentTimestamp: '',
  },
  awsRegion: 'any',
  body: '',
  eventSource: '',
  eventSourceARN: '',
  md5OfBody: '',
  messageAttributes: {},
  messageId: '',
  receiptHandle: '',
}

const messages: {
  event: SQSEvent
  response: {
    success: boolean
  }
  enabled: boolean
}[] = [
  {
    response: { success: true },
    event: { Records: [{ ...baseRecord, messageId: '1' }] },
    enabled: true,
  },
  {
    response: { success: true },
    event: {
      Records: [
        { ...baseRecord, messageId: '1' },
        { ...baseRecord, messageId: '2' },
      ],
    },
    enabled: true,
  },
  {
    response: { success: false },
    event: { Records: [{ ...baseRecord, messageId: '1' }] },
    enabled: true,
  },
  {
    response: { success: false },
    event: {
      Records: [
        { ...baseRecord, messageId: '1' },
        { ...baseRecord, messageId: '2' },
      ],
    },
    enabled: true,
  },
  {
    response: { success: false },
    event: {
      Records: [
        { ...baseRecord, messageId: '1' },
        { ...baseRecord, messageId: '2' },
      ],
    },
    enabled: false,
  },
]

describe('sqs message wrapper tests', () => {
  describe('should handle response, returns', () => {
    it.each(messages)('results matching snapshot', async ({ event, response, enabled }) => {
      jest.resetAllMocks()
      const wrapper = sqsMessageWrapper({
        handler: async ({ messageId }) => ({
          ...response,
          messageId,
        }),
        parse: ({ body }) => ({
          ...response,
          body,
        }),
        region: 'eu-west-1',
        env: 'dev',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        getClientOptions: () => clientOptions,
        enabled,
        errorActions,
      })
      const cb: any = null
      const result = await wrapper(event, {} as any, cb)
      expect(result).toMatchSnapshot()
    })
  })

  describe('should handle errors, returns', () => {
    it.each(errors)('results matching snapshot', async ({ error, messageId }) => {
      jest.resetAllMocks()
      const wrapper = sqsMessageWrapper({
        handler: async () => {
          throw error
        },
        parse: ({ body }) => ({
          body,
        }),
        region: 'eu-west-1',
        env: 'dev',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        getClientOptions: () => clientOptions,
        enabled: true,
        errorActions,
      })
      const cb: any = null
      const result = await wrapper(
        {
          Records: [
            {
              ...baseRecord,
              messageId,
            },
          ],
        },
        {} as any,
        cb
      )
      expect(result).toMatchSnapshot()
    })
  })
})
