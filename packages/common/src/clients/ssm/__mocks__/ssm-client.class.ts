import { NamedRef } from '../../../types'
import { SMClientOptions, ISMClient } from '../types'

export class SMClientMock implements ISMClient {
  public readonly prefix: string
  public readonly names: Record<string, NamedRef>

  getValue = jest.fn()
  setValue = jest.fn()
  destroy = jest.fn()

  constructor({ prefix, names }: SMClientOptions) {
    this.prefix = prefix
    this.names = names
  }
}
