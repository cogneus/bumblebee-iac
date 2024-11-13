export interface Params {
  stage?: string
  region?: string
  component?: string
  branch?: string
}

export interface ConfigParams extends Params {
  coreConfigFile: string
  configFile: string
  environmentName: string
}
