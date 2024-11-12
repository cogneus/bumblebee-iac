#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BumblebeeIacStack, type Config } from "../lib";
import { existsSync, readFileSync } from "fs";
import path = require("path");

const loadConfigFile = (path: string): Config => {
  if (existsSync(path)) {
    const file = readFileSync(path, "utf8");
    return JSON.parse(file);
  }
  throw new Error("Config file not found");
};

const main = async () => {
  const config = loadConfigFile(path.resolve("./env.json"));
  const app = new cdk.App();
  const {
    awsAccountId: account,
    region,
    prefix: { name, qual: qualifier },
    stage,
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
      }),
    },
    config
  );

  app.synth();
};
main();
