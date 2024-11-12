import { ClientOptions } from '../../../clients'
import { stateMachineWrapper } from '../state-machine.wrapper'
import { StateMachineInput, StateMachinePayload } from '../types'

const baseInput: StateMachineInput<StateMachinePayload> = {
  payload: {
    test: 'test',
  },
}

const events = [
  {
    input: baseInput,
    response: {
      result: 'success',
    },
  },
  {
    input: baseInput,
    response: {
      result: 'success',
    },
  },
  {
    input: baseInput,
    error: {
      message: 'failure',
    },
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

describe('step function wrapper tests', () => {
  describe('should handle response, returns', () => {
    it.each(events)('results matching snapshot', async ({ input, response, error }) => {
      jest.resetAllMocks()
      const wrapper = stateMachineWrapper({
        handler: async ({ payload }) => {
          if (error) {
            throw error
          }
          return {
            ...payload,
            ...response,
          }
        },
        region: 'eu-west-1',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        env: 'dev',
        getClientOptions: () => clientOptions,
      })
      const cb: any = null
      let result: any = null
      let ex: any = null
      try {
        result = await wrapper(input, {} as any, cb)
      } catch (e) {
        ex = e
      }
      if (ex && error) {
        expect(ex.message).toMatch(error.message)
      } else {
        expect(result).toMatchSnapshot()
      }
    })
  })
})
