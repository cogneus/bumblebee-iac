import { loadConfig } from './load-config'
import { processConfig } from './process-config'
import { ConfigParams } from './config-params.interface'
import { Config } from './config.interface'
import path = require('path')
import { defaultConfigFile, defaultCoreConfigFile } from './const'

export const getConfig = ({
  coreConfigFile = defaultCoreConfigFile,
  configFile = defaultConfigFile,
  environmentName,
  stage,
  deployStage,
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
  config = processConfig(config, { component, region, stage, branch, deployStage })
  return config as Config
}
