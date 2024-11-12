import { Context } from 'aws-lambda'
import { Logger } from '../logger'
import { Clients } from '../clients/types/clients.interface'
import { ClientOptions } from '../clients/types/client-options.interface'

export interface ServiceContext extends Context {
  clients: Clients
  clientOptions: ClientOptions
  log: Logger
  env: string
  region: string
}
