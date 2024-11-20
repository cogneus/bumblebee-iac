import 'source-map-support/register'
import { ServiceContext } from '../../types'
import { createWrapperContext } from '../utils'
import { IamAuthorizerWrapper } from './types'
import { makeAPIInfo } from './make-api-info'
import { getTokenFromAuthEvent } from '../../auth'
import { logEvent } from './log-event'
import { destroyClients } from '../../clients'
import { generatePolicy } from './generate-policy'

export const iamAuthorizerWrapper: IamAuthorizerWrapper =
  ({ handler, getClientOptions, ...contextParams }) =>
  async (event, context: ServiceContext) => {
    const apiInfo = makeAPIInfo(event, contextParams)
    const serviceContext = createWrapperContext({
      ...contextParams,
      context,
      logInfo: { apiInfo },
      clientOptions: getClientOptions(),
    })

    try {
      const token = getTokenFromAuthEvent(event)
      const decoded = await handler({
        serviceContext,
        apiInfo,
        token,
      })

      logEvent(serviceContext, apiInfo, decoded)
      return generatePolicy(apiInfo, decoded)
    } catch (ex) {
      logEvent(serviceContext, apiInfo, undefined, ex)
      return generatePolicy(apiInfo)
    } finally {
      destroyClients(serviceContext.clients)
    }
  }
