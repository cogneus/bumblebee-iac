import { all } from 'deepmerge'
import { readFileSync, existsSync } from 'fs'

export const loadConfigFile = (path: string) => {
  if (existsSync(path)) {
    const file = readFileSync(path, 'utf8')
    return JSON.parse(file)
  }
  return {}
}

export const loadConfig = (
  coreConfigPath: string,
  localConfigPath: string,
  evnvironmentName: string
) => {
  const localCore = loadConfigFile(`${localConfigPath}/config.json`)
  const localEnv = loadConfigFile(`${localConfigPath}/${evnvironmentName}.json`)
  const env = loadConfigFile(`${coreConfigPath}/${evnvironmentName}.json`)
  const template = loadConfigFile(`${coreConfigPath}/template.json`)
  const core = loadConfigFile(`${coreConfigPath}/core.json`)
  const files = [template, core, env, localCore, localEnv]
  const merged = all(files)
  return merged
}
