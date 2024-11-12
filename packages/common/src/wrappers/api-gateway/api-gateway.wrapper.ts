import 'source-map-support/register'
import { InvalidAuthorizartion, StatusCodes } from '../../exceptions'
import { ServiceContext } from '../../types'
import { createWrapperContext } from '../utils'
import { decodeToken } from '../../auth'
import { handleError } from './handle-error'
import { tryParse } from './try-parse'
import { APIGatewayWrapper, APIGatewayWrapperParams } from './types'
import { destroyClients } from '../../clients'
import { APIResponseHeaders } from './consts'

export const apiGatewayWrapper: APIGatewayWrapper =
  <TPayload, TParams, TToken, TResult>({
    handler,
    getClientOptions,
    authCheck,
    ...contextParams
  }: APIGatewayWrapperParams<TPayload, TParams, TToken, TResult>) =>
  async (event, context: ServiceContext) => {
    const { body, pathParameters, queryStringParameters, headers } = event
    const params = {
      ...(pathParameters as Record<string, any>),
      ...(queryStringParameters as Record<string, any>),
    } as TParams
    const serviceContext = createWrapperContext({
      ...contextParams,
      context,
      logInfo: {
        pathParameters,
        queryStringParameters,
        body,
      },
      clientOptions: getClientOptions(params),
    })
    const { log } = serviceContext

    try {
      const token: TToken = decodeToken(headers)
      if (!authCheck(token, serviceContext)) {
        throw InvalidAuthorizartion()
      }
      log.debug('Process input', event)

      const result = await handler({
        params,
        payload: tryParse<TPayload>(body),
        serviceContext,
      })

      log.debug('Process complete', result as any)
      return {
        body: JSON.stringify(result),
        statusCode: StatusCodes.Success,
        headers: APIResponseHeaders,
      }
    } catch (ex) {
      log.warn(`Process failed, ${ex.message}`)
      log.error(ex)
      return handleError(ex)
    } finally {
      destroyClients(serviceContext.clients)
    }
  }
