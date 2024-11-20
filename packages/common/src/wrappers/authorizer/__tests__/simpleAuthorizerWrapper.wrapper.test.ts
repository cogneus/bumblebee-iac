import { APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda'
import { simpleAuthorizerWrapper } from '../simple-authorizer.wrapper'
import { Token } from '../../../auth'

const decodedToken: Token = {
  email: 'someone@test.com',
  givenName: 'Test',
  legalName: 'User',
  rights: [],
  subject: 'test',
  uid: 'id',
}
const routeArn: string = 'arn:aws:execute-api:region:0123456:appId/stage/METHOD/execute'
const events: {
  event: Partial<APIGatewayRequestAuthorizerEventV2>
  decodedToken?: Token
}[] = [
  {
    event: {
      type: 'REQUEST',
      routeArn,
      identitySource: [
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ],
      requestContext: {
        apiId: 'test',
      } as any,
    },
    decodedToken,
  },
]

describe('authorizer wrapper tests', () => {
  describe('should handle response, returns', () => {
    it.each(events)('results matching snapshot', async ({ event, decodedToken: decoded }) => {
      jest.resetAllMocks()
      const wrapper = simpleAuthorizerWrapper({
        handler: async () => {
          if (decoded) {
            return decoded
          }
          throw Error('No Token')
        },
        region: 'eu-west-1',
        env: 'dev',
        logName: 'wrapper-test',
        serviceName: 'wrapper-test',
        getClientOptions: () => ({}),
      })

      const cb: any = null
      const result = await wrapper(event as APIGatewayRequestAuthorizerEventV2, {} as any, cb)
      expect(result).toMatchSnapshot()
    })
  })
})
