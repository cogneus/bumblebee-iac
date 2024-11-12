import { NamedRef } from '../../../types'
import { SecretsClientOptions, ISecretsClient } from '../types'

export class SecretsClientMock implements ISecretsClient {
  public readonly prefix: string
  public readonly idPrefix: string
  public readonly names: Record<string, NamedRef>
  public readonly ids: Record<string, NamedRef>

  ensure = jest.fn()
  getValue = jest.fn()
  setValue = jest.fn()
  destroy = jest.fn()

  constructor({ prefix, names, ids, idPrefix }: SecretsClientOptions) {
    this.idPrefix = idPrefix
    this.prefix = prefix
    this.names = names
    this.ids = ids
  }
}
