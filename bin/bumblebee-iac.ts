#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BumblebeeIacStack, type Config } from "../lib";
import path = require("path");
import { getConfig } from "../scripts/config";
import { env } from 'process'
import { existsSync, readFileSync } from "fs";

const loadConfigFile = (): Config => {
  const configFile = './env.json'
  if (existsSync(configFile)) {
    const file = readFileSync(configFile, "utf8");
    return JSON.parse(file);
  }
  const {
    environmentName,
    branch,
    component,
    region,
    stage
  } = env
  if (!environmentName || !region || !component) {
    throw new Error(`Invalid environment configuration environmentName: ${environmentName} region: ${region} component: ${component}`)
  }
  return getConfig({
    coreConfigFile: path.resolve('./config/core.json'),
    configFile: path.resolve(configFile),
    environmentName,
    branch,
    component,
    region,
    stage
  })
};

const main = async () => {
  const config = loadConfigFile();
  const app = new cdk.App({
    context: {
      [cdk.PERMISSIONS_BOUNDARY_CONTEXT_KEY]: {
        name: config.iam.permissionsBoundaryName,
      },
    },
  });
  const {
    awsAccountId: account,
    region,
    prefix: { name, qual: qualifier },
    stage,
    s3: {
      cdkBucket: fileAssetsBucketName
    },
    component,
  } = config;
  const resourceName = `${name}-${stage}-${component}-cdk-pipeline-stack`;
  new BumblebeeIacStack(
    app,
    resourceName,
    {
      env: {
        account,
        region,
      },
      synthesizer: new cdk.DefaultStackSynthesizer({
        qualifier,
        fileAssetsBucketName,
      }),
    },
    config
  );

  app.synth();
};
main();
