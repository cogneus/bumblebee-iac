import { saveConfigFile } from './save-config'
import { ConfigParams } from './config-params.interface'
import { getConfig } from './get-config'

export const main = (params: ConfigParams) => {
  const config = getConfig(params)
  saveConfigFile(params.configFile, config)
}
