import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { apiGatewayWrapper } from '../api-gateway.wrapper'
import { ClientOptions } from '../../../clients'
import { AppException, StatusCodes } from '../../../exceptions'

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

const events: Partial<APIGatewayProxyEventV2>[] = [
  {
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    },
    pathParameters: {
      testPathParam: 'test-path-param',
    },
    queryStringParameters: {
      testQueryParam: 'test-query-param',
    },
    body: '{"test": "body"}',
  },
]

const invalidEvents: {
  event: Partial<APIGatewayProxyEventV2>
  error?: AppException
}[] = [
  {
    error: {
      name: 'NotFound',
      code: 'NotFound',
      message: 'NotFound',
      status: StatusCodes.NotFound,
    },
    event: {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyaWdodHMiOlsiV1JJVEUiXX0.0_slzFK8MqvPbpToNcRqPBjrDjUL_b6XbgqnMNK4Pe4',
      },
      pathParameters: {
        testPathParam: 'test-path-param',
      },
      queryStringParameters: {
        testQueryParam: 'test-query-param',
      },
      body: '{"test": "body"}',
    },
  },
  {
    error: {
      name: 'Error',
      code: 'Error',
      message: 'Error',
      status: StatusCodes.Error,
    },
    event: {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyaWdodHMiOlsiV1JJVEUiXX0.0_slzFK8MqvPbpToNcRqPBjrDjUL_b6XbgqnMNK4Pe4',
      },
      pathParameters: {
        testPathParam: 'test-path-param',
      },
      queryStringParameters: {
        testQueryParam: 'test-query-param',
      },
      body: '{"test": "body"@',
    },
  },
  {
    error: {
      name: 'Forbidden',
      code: 'Forbidden',
      message: 'Forbidden',
      status: StatusCodes.Forbidden,
    },
    event: {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyaWdodHMiOlsiV1JJVEUiXX0.0_slzFK8MqvPbpToNcRqPBjrDjUL_b6XbgqnMNK4Pe4',
      },
      pathParameters: {
        testPathParam: 'test-path-param',
      },
      queryStringParameters: {
        testQueryParam: 'test-query-param',
      },
      body: '{"test": "body"}',
    },
  },
  {
    error: {
      name: 'BadRequest',
      code: 'BadRequest',
      message: 'BadRequest',
      status: StatusCodes.BadRequest,
    },
    event: {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyaWdodHMiOlsiV1JJVEUiXX0.0_slzFK8MqvPbpToNcRqPBjrDjUL_b6XbgqnMNK4Pe4',
      },
      pathParameters: {
        testPathParam: 'test-path-param',
      },
      queryStringParameters: {
        testQueryParam: 'test-query-param',
      },
      body: '{"test": "body"}',
    },
  },
  {
    event: {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyaWdodHMiOlsiV1JJVEUiXX0.0_slzFK8MqvPbpToNcRqPBjrDjUL_b6XbgqnMNK4Pe4',
      },
      pathParameters: {
        testPathParam: 'test-path-param',
      },
      queryStringParameters: {
        testQueryParam: 'test-query-param',
      },
      body: '{"test": "body"',
    },
  },
  {
    event: {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyaWdodHMiOlsiUkVBRCJdfQ.Qhhxqxb7HqVcdSUSnmntHi1VkMGDkD0o3VoWgzvy-H8',
      },
      pathParameters: {
        testPathParam: 'test-path-param',
      },
      queryStringParameters: {
        testQueryParam: 'test-query-param',
      },
      body: '{"test": "body"}',
    },
  },
]

describe('api gateway wrapper tests', () => {
  describe('should handle response, returns', () => {
    it.each(events)('results matching snapshot', async (event) => {
      jest.resetAllMocks()
      const results: any[] = []
      const wrapper = apiGatewayWrapper({
        handler: async ({ serviceContext, params, payload }) => {
          results.push({
            params,
            payload,
            serviceContext,
          })
          return {
            body: '{}',
            statusCode: 200,
          }
        },
        region: 'eu-west-1',
        env: 'dev',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        getClientOptions: () => clientOptions,
        authCheck: () => {
          return true
        },
      })

      const cb: any = null
      await wrapper(event as APIGatewayProxyEventV2, {} as any, cb)
      expect(results).toMatchSnapshot()
    })
  })

  describe('should throw Error, returns', () => {
    it.each(invalidEvents)('results matching snapshot', async ({ event, error }) => {
      jest.resetAllMocks()
      const wrapper = apiGatewayWrapper({
        handler: async () => {
          if (error) {
            throw error
          }
          return {
            body: '{}',
            statusCode: 200,
          }
        },
        region: 'eu-west-1',
        env: 'dev',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        getClientOptions: () => clientOptions,
        authCheck: (token: any) => token?.rights.includes('WRITE') || false,
      })

      const cb: any = null
      const result = await wrapper(event as APIGatewayProxyEventV2, {} as any, cb)
      expect(result).toMatchSnapshot()
    })
  })
})
