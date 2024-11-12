import { loadConfig } from './load-config'
import { processConfig } from './process-config'
import { saveConfigFile } from './safe-config'
import { ConfigParams } from './types'

export const main = ({
  coreConfigFile,
  configFile,
  environmentName,
  stage,
  region,
  component,
  branch,
}: ConfigParams) => {
  console.log(
    `Loading config for ${environmentName} ${stage} ${region} ${component} to file ${configFile}`
  )
  const coreConfigPath = coreConfigFile.substring(0, coreConfigFile.lastIndexOf('/'))
  const localConfigPath = configFile.substring(0, configFile.lastIndexOf('/'))
  let config = loadConfig(coreConfigPath, localConfigPath, environmentName)
  config = processConfig(config, { component, region, stage, branch })
  saveConfigFile(configFile, config)
}
