import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BumblebeeAppStack } from './bumblebee-app-iac-stack'
import { Config, getConfig } from '../scripts/config'
import * as ssm from 'aws-cdk-lib/aws-ssm'

export class BumblebeeAppDeployStage extends cdk.Stage {
  constructor(scope: Construct, targetRegion: string, config: Config) {
    const {
      awsAccountId: account,
      region,
      ssm: { activeStage },
      prefix: { name },
      environmentName,
      github: { branch },
      component,
      stage
    } = config
    const deployStage = ssm.StringParameter.valueForStringParameter(
      scope,
      `${activeStage}/${component}`
    )
    super(scope, 'Deploy', {
      stageName: `Deploy`,
      env: {
        account,
        region,
      },
    })
    const serviceConfig = getConfig({
      environmentName,
      branch,
      component,
      region: targetRegion,
      stage,
      deployStage,
    })

    new BumblebeeAppStack(this, serviceConfig)
  }
}
