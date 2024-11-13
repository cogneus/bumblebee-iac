import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BumblebeeAppStack } from './bumblebee-app-iac-stack'
import { Config } from '../scripts/config'
import * as ssm from 'aws-cdk-lib/aws-ssm'

export class BumblebeeAppDeployStage extends cdk.Stage {
  constructor(scope: Construct, config: Config) {
    const {
      awsAccountId: account,
      region,
      ssm: { activeStage },
    } = config
    super(scope, 'Deploy', {
      env: {
        account,
        region,
      },
    })
    const stage = ssm.StringParameter.valueForStringParameter(
      this,
      activeStage
    )
    
    /*new BumblebeeAppStack(this, {
      ...config,
      stage,
    })*/
  }
}
