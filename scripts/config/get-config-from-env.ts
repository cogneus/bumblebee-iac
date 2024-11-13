import { existsSync, readFileSync } from 'fs'
import { Config } from './config.interface'
import path = require('path')
import { getConfig } from './get-config'
import { env } from 'process'
import { defaultConfigFile } from './const'

export const getConfigFromEnv = (): Config => {
  const configFile = defaultConfigFile
  if (existsSync(configFile)) {
    const file = readFileSync(configFile, 'utf8');
    return JSON.parse(file);
  }
  const { environmentName, branch, component, region, stage } = env;
  if (!environmentName || !region || !component) {
    throw new Error(
      `Invalid environment configuration environmentName: ${environmentName} region: ${region} component: ${component}`
    );
  }
  return getConfig({
    configFile,
    environmentName,
    branch,
    component,
    region,
    stage,
  });
};