import { loadConfig } from './load-config'
import { processConfig } from './process-config'
import { ConfigParams } from './config-params.interface'
import { Config } from './config.interface'

export const getConfig = ({
  coreConfigFile,
  configFile,
  environmentName,
  stage,
  region,
  component,
  branch,
}: ConfigParams): Config => {
  console.log(
    `Loading config for ${environmentName} ${stage} ${region} ${component} to file ${configFile}`
  )
  const coreConfigPath = coreConfigFile.substring(0, coreConfigFile.lastIndexOf('/'))
  const localConfigPath = configFile.substring(0, configFile.lastIndexOf('/'))
  let config = loadConfig(coreConfigPath, localConfigPath, environmentName)
  config = processConfig(config, { component, region, stage, branch })
  return config as Config
}
