import { existsSync, readFileSync } from 'fs'
import { Config } from './config.interface'
import path = require('path')
import { getConfig } from './get-config'
import { env } from 'process'

export const getConfigFromEnv = (): Config => {
  const configFile = path.resolve('./env.json')
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
    coreConfigFile: path.resolve('./config/core.json'),
    configFile: path.resolve(configFile),
    environmentName,
    branch,
    component,
    region,
    stage,
  });
};