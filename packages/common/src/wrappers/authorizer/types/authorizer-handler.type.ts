import { Token } from '../../../auth'
import { AuthorizerDependencies } from './authorizer-dependencies.interface'

export type AuthorizerHandler = (args: AuthorizerDependencies) => Promise<Token>
