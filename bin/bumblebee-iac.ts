#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BumblebeeIacStack } from '../lib'
import { getConfigFromEnv } from '../scripts/config'
import { getSSMValue } from '../lib/utils/ssm'

const main = async () => {
  const config = getConfigFromEnv()
  const { ssm: { activeStage }, component, defaultDeployStage, deployStages} = config
  const currentStage = await getSSMValue(`${activeStage}/cdk-${component}`, config, '')
  const deployStage = currentStage === deployStages.blue ? deployStages.green : deployStages.blue

  const app = new cdk.App({
    context: {
      [cdk.PERMISSIONS_BOUNDARY_CONTEXT_KEY]: {
        name: config.iam.permissionsBoundaryName,
      },
      deployStage
    },
  })

  new BumblebeeIacStack(app, config)
  app.synth()
}
main()
