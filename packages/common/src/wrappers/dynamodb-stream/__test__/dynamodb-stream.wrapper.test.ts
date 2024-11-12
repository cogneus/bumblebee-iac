import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda'
import { dynamoDBStreamWrapper } from '../dynamodb-stream.wrapper'
import { ClientOptions } from '../../../clients'

const baseRecord: DynamoDBRecord = {
  awsRegion: 'any',
  eventSource: '',
  eventSourceARN: 'a207919-vespa-ci-test-main-',
}

const baseStagingRecord: DynamoDBRecord = {
  ...baseRecord,
  eventSourceARN: 'a207919-vespa-ci-test-staging-',
}

const baseUnknownRecord: DynamoDBRecord = {
  ...baseRecord,
  eventSourceARN: 'a207919-vespa-ci-test-blue-',
}

const baseUndefinedRecord: any = {
  ...baseRecord,
  eventSourceARN: undefined,
}

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

const baseImage = {
  PK: {
    S: 'template#test-template',
  },
  SK: {
    S: 'version#0000000000',
  },
  created: {
    S: '2023-02-19T14:46:24.905Z',
  },
}

const events: DynamoDBStreamEvent[] = [
  {
    Records: [
      {
        ...baseRecord,
        eventName: 'INSERT',
        dynamodb: {
          NewImage: baseImage,
        },
      },
      {
        ...baseRecord,
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: baseImage,
        },
      },
    ],
  },
  {
    Records: [
      {
        ...baseRecord,
        eventName: 'REMOVE',
        dynamodb: {
          NewImage: baseImage,
        },
      },
      {
        ...baseRecord,
        eventName: 'MODIFY',
        dynamodb: {},
      },
    ],
  },
  {
    Records: [
      {
        ...baseStagingRecord,
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: baseImage,
        },
      },
      {
        ...baseStagingRecord,
        eventName: 'MODIFY',
        dynamodb: {},
      },
    ],
  },
]

const invalidEvents: DynamoDBStreamEvent[] = [
  {
    Records: [
      {
        ...baseRecord,
        eventName: 'INSERT',
        dynamodb: {
          NewImage: baseImage,
        },
      },
      {
        ...baseUnknownRecord,
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: baseImage,
        },
      },
    ],
  },
  {
    Records: [
      {
        ...baseRecord,
        eventName: 'INSERT',
        dynamodb: {
          NewImage: baseImage,
        },
      },
      {
        ...baseUndefinedRecord,
        eventName: 'MODIFY',
        dynamodb: {
          NewImage: baseImage,
        },
      },
    ],
  },
]

describe('dynamo db stream wrapper tests', () => {
  describe('should handle response, returns', () => {
    it.each(events)('results matching snapshot', async (event) => {
      jest.resetAllMocks()
      const results: any[] = []
      const wrapper = dynamoDBStreamWrapper({
        handler: async ({ item, eventName }) => {
          results.push({
            eventName,
            item,
          })
        },
        region: 'eu-west-1',
        env: 'dev',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        getClientOptions: () => clientOptions,
      })

      const cb: any = null
      await wrapper(event, {} as any, cb)
      expect(results).toMatchSnapshot()
    })
  })

  describe('should throw Error, returns', () => {
    it.each(invalidEvents)('results matching snapshot', async (event) => {
      jest.resetAllMocks()
      const results: any[] = []
      const wrapper = dynamoDBStreamWrapper({
        handler: async ({ item, eventName }) => {
          results.push({
            eventName,
            item,
          })
        },
        region: 'eu-west-1',
        env: 'dev',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        getClientOptions: () => clientOptions,
      })

      const cb: any = null
      await wrapper(event, {} as any, cb)
      expect(results).toMatchSnapshot()
    })
  })
})
