import { Token } from '../../auth'
import { ServiceContext } from '../../types'
import { APIGatewayInfo } from './types'

export const logEvent = (
  { log }: ServiceContext,
  { region, id }: APIGatewayInfo,
  token?: Token,
  error?: Error
) => {
  const msg = token
    ? 'Authorization token verification successful'
    : 'Authorization token verification failed'

  const { email, givenName, legalName, rights, uid } = token || {}

  const eventSummary = {
    originator: {
      email,
      givenName,
      legalName,
      rights,
      uid,
    },
    targetResource: {
      region,
      id,
    },
    msg,
    error,
  }

  if (token) {
    log.info(eventSummary)
  } else {
    log.warn(eventSummary)
  }
}
