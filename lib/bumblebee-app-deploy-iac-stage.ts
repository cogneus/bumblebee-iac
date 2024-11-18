import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BumblebeeAppStack } from './bumblebee-app-iac-stack';
import { Config, getConfig } from '../scripts/config';

export class BumblebeeAppDeployStage extends cdk.Stage {
  constructor(scope: Construct, targetRegion: string, config: Config) {
    const {
      awsAccountId: account,
      region,
      regionCodes,
      prefix: { name },
      environmentName,
      github: { branch },
      component,
      stage,
    } = config;
    const deployStage = scope.node.getContext('deployStage');
    const stageName = `${name}-${deployStage}-${component}-${regionCodes[targetRegion]}-cdk-deploy-stage`;
    super(scope, stageName, {
      env: {
        account,
        region,
      },
      stageName: `Deploy-${regionCodes[targetRegion]}-${deployStage}`,
    });
    const serviceConfig = getConfig({
      environmentName,
      branch,
      component,
      region: targetRegion,
      stage,
      deployStage,
    });

    new BumblebeeAppStack(this, serviceConfig);
  }
}
