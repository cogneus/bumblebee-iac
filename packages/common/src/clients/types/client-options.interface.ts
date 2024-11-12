import { DBClientOptions, SMClientOptions, SecretsClientOptions } from '..'

export interface ClientOptions {
  secrets?: SecretsClientOptions
  db?: DBClientOptions
  ssm?: SMClientOptions
}
