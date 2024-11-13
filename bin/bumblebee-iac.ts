#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BumblebeeIacStack } from '../lib'
import { getConfigFromEnv } from '../scripts/config'

const main = async () => {
  const config = getConfigFromEnv()
  const app = new cdk.App({
    context: {
      [cdk.PERMISSIONS_BOUNDARY_CONTEXT_KEY]: {
        name: config.iam.permissionsBoundaryName,
      },
    },
  })
  new BumblebeeIacStack(app, config)

  app.synth()
}
main()
