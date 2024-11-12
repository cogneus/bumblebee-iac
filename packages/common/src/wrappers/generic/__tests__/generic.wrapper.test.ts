import { genericWrapper } from '../generic.wrapper'
import { ClientOptions } from '../../../clients'

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

describe('api gateway wrapper tests', () => {
  describe('should handle response, returns', () => {
    test('results matching snapshot', async () => {
      jest.resetAllMocks()
      const results: any[] = []
      const wrapper = genericWrapper({
        handler: async ({ serviceContext, event }) => {
          results.push({
            event,
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
      })

      const cb: any = null
      await wrapper({ test: 'event' }, {} as any, cb)
      expect(results).toMatchSnapshot()
    })
  })
})
