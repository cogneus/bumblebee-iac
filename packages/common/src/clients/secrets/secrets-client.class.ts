import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
  CreateSecretCommand,
  SecretsManagerServiceException,
} from '@aws-sdk/client-secrets-manager'
import { SecretsClientOptions, ISecretsClient } from './types'
import { NamedRef, ServiceContext } from '../../types'
import { Logger } from '../../logger'
import { errorSource } from '../../exceptions'

export class SecretsClient implements ISecretsClient {
  public readonly prefix: string
  public readonly idPrefix: string
  public readonly names: Record<string, NamedRef>
  public readonly ids: Record<string, NamedRef>
  private readonly kmsId: string
  private readonly log: Logger
  private readonly client: SecretsManagerClient

  constructor(
    { prefix, idPrefix, names, ids, kmsId }: SecretsClientOptions,
    context: ServiceContext
  ) {
    this.client = new SecretsManagerClient({})
    this.log = context.log.getScopedLogger({ name: 'SecretsClient' })
    this.prefix = prefix
    this.idPrefix = idPrefix
    this.names = names
    this.ids = ids
    this.kmsId = kmsId
  }

  public async ensure(name: string, value: any): Promise<void> {
    const secretId = `${this.prefix}-${name}`
    let secretValue: string | undefined
    let createSecret: boolean = false
    try {
      secretValue =
        value && typeof value === 'object' ? JSON.stringify(value) : (`${value}` as string)
      this.log.debug(`Setting ${secretId} in Secret Manager`)
      await this.client.send(
        new PutSecretValueCommand({
          SecretString: secretValue,
          SecretId: secretId,
        })
      )
    } catch (ex) {
      const error = errorSource<SecretsManagerServiceException>(ex)
      if (error.name === 'ResourceNotFoundException') {
        createSecret = true
      } else {
        this.log.error(`Failed to set ${secretId}, ${ex.message}`, { error })
        throw error
      }
    }

    if (createSecret) {
      try {
        this.log.debug(`Creating ${secretId} in Secret Manager`)
        await this.client.send(
          new CreateSecretCommand({
            SecretString: secretValue,
            Name: secretId,
            KmsKeyId: this.kmsId,
          })
        )
      } catch (ex) {
        const error = errorSource(ex)
        this.log.error(`Failed to create ${secretId}, ${ex.message}`, { error })
        throw error
      }
    }
  }

  public async getValue(id: string): Promise<string | undefined> {
    const secretId = `${this.idPrefix}-${id}`
    try {
      this.log.debug(`Getting ${secretId} from Secret Manager`)
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secretId,
        })
      )
      return response.SecretString
    } catch (ex) {
      const error = errorSource(ex)
      this.log.error(`Failed to get ${secretId}, ${ex.message}`, { error })
      throw error
    }
  }

  public async setValue(name: string, value: any): Promise<void> {
    const secretId = `${this.prefix}-${name}`
    try {
      const secretValue: string =
        value && typeof value === 'object' ? JSON.stringify(value) : (`${value}` as string)
      this.log.debug(`Setting ${secretId} in Secret Manager`)
      await this.client.send(
        new PutSecretValueCommand({
          SecretString: secretValue,
          SecretId: secretId,
        })
      )
    } catch (ex) {
      const error = errorSource(ex)
      this.log.error(`Failed to set ${secretId}, ${ex.message}`, { error })
      throw error
    }
  }

  public destroy() {
    this.client?.destroy()
  }
}
