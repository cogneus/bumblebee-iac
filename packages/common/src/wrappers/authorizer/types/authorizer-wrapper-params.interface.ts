import { ClientOptions } from '../../../clients'
import { WrapperParams } from '../../types'
import { AuthorizerHandler } from './authorizer-handler.type'

export interface AuthorizerWrapperParams
  extends WrapperParams<AuthorizerHandler, () => ClientOptions> {}
