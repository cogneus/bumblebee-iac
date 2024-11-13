import { saveConfigFile } from './save-config'
import { ConfigParams } from './config-params.interface'
import { getConfig } from './get-config'
import { defaultConfigFile } from './const'

export const main = (params: ConfigParams) => {
  const config = getConfig(params)
  saveConfigFile(params.configFile || defaultConfigFile, config)
}
