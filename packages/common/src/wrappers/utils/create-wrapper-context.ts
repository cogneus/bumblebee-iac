import { ConsoleLogger } from '../../logger'
import { ServiceContext } from '../../types'
import { WrapperContextParams } from '../types'

export const createWrapperContext = ({
  context,
  serviceName,
  logName,
  logInfo,
  logLevel,
  env,
  region,
  clientOptions,
}: WrapperContextParams): ServiceContext => {
  const log = new ConsoleLogger(
    {
      level: logLevel,
      includeSrc: true,
    },
    {
      name: logName,
      env,
      region,
      serviceName,
      ...logInfo,
    }
  )
  return {
    ...context,
    ...(clientOptions ? { clientOptions } : {}),
    env,
    region,
    log,
  }
}
