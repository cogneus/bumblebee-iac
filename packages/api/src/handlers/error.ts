import { standardEnvVars, warmupWrapper, genericWrapper } from 'bumblebee-common'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

export const main = warmupWrapper(
  genericWrapper<APIGatewayProxyEventV2, APIGatewayProxyResultV2>({
    handler: async ({ serviceContext: { log }, event }) => {
      const {
        rawPath,
        requestContext: {
          http: { method },
        },
      } = event
      const message = 'Resource not found'
      const error = {
        unrecognizedResource: {
          method: method,
          endpoint: rawPath,
        },
      }

      log.warn(message, { error })

      return {
        statusCode: 404,
        body: JSON.stringify({ message, error }),
      }
    },
    ...standardEnvVars(),
    serviceName: 'api',
    logName: 'error',
    getClientOptions: () => ({}),
  })
)
