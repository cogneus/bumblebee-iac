import { InvalidService } from '../exceptions'
import { ServiceContext } from '../types'
import {
  ClientNames,
  Destroyable,
  SMClient,
  SMClientOptions,
  DBClient,
  DBClientOptions,
  SecretsClient,
  SecretsClientOptions,
} from '.'

export const ensureClient = <TClient>(context: ServiceContext, name: ClientNames): TClient => {
  const clients = (context.clients = context.clients || {})
  let client = clients[name]
  if (!client) {
    client = clients[name] = makeClient(context, name) as any
  }
  return client as TClient
}

const makeClient = (context: ServiceContext, name: ClientNames): Destroyable => {
  const { clientOptions } = context
  const options = clientOptions?.[name]

  if (!options) {
    throw InvalidService(name)
  }

  switch (name) {
    case 'ssm':
      return new SMClient(options as SMClientOptions, context)
    case 'db':
      return new DBClient(options as DBClientOptions, context)
    case 'secrets':
      return new SecretsClient(options as SecretsClientOptions, context)
  }
}
