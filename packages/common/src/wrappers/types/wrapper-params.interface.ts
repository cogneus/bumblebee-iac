import { WrapperBaseParams } from './wrapper-base-params.interface'

export interface WrapperParams<THandler, TClientOptions> extends WrapperBaseParams {
  handler: THandler
  getClientOptions: TClientOptions
}
