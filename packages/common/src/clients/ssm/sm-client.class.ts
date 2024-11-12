import {
  GetParameterCommand,
  ParameterType,
  PutParameterCommand,
  SSMClient,
} from '@aws-sdk/client-ssm'
import { NamedRef, ServiceContext } from '../../types'
import { SMClientOptions, ISMClient } from './types'
import { Logger } from '../../logger'

export class SMClient implements ISMClient {
  public readonly prefix: string
  public readonly names: Record<string, NamedRef>
  private readonly log: Logger
  private readonly client: SSMClient

  constructor({ prefix, names }: SMClientOptions, context: ServiceContext) {
    this.log = context.log.getScopedLogger({ name: 'SMClient' })
    this.prefix = prefix
    this.names = names
    this.client = new SSMClient({})
  }

  public async getValue(name: string, withDecryption = false): Promise<string | undefined> {
    const path = `${this.prefix}/${name}`
    try {
      this.log.debug(`Getting ${path} from SSM`)
      const response = await this.client.send(
        new GetParameterCommand({
          Name: path,
          WithDecryption: withDecryption,
        })
      )
      return response.Parameter?.Value
    } catch (ex) {
      this.log.debug(`Failed to get ${path}, ${ex.message}`)
    }
  }

  public async setValue(name: string, value: string, type: ParameterType = ParameterType.STRING) {
    const path = `${this.prefix}/${name}`
    try {
      this.log.debug(`Setting ${path} to ${value}`)
      await this.client.send(
        new PutParameterCommand({
          Name: path,
          Value: value,
          Overwrite: true,
          DataType: 'text',
          Type: type,
        })
      )
    } catch (ex) {
      this.log.error(`Failed to set ${path}, ${ex.message}`)
      throw ex
    }
  }

  public destroy() {
    this.client?.destroy()
  }
}
