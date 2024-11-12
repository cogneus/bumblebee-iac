import { ClientOptions } from '../../clients'
import { ServiceContext } from '../../types'
import { WrapperBaseParams } from './wrapper-base-params.interface'

export interface WrapperContextParams extends WrapperBaseParams {
  context: ServiceContext
  logInfo: Record<string, any>
  clientOptions?: ClientOptions
}
