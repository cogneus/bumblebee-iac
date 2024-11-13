import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
} from "aws-cdk-lib/pipelines"
import type { Config } from "../scripts/config/config.interface"
import { BumblebeeAppDeployStage } from "./bumblebee-app-deploy-iac-stage"

export class BumblebeeIacStack extends cdk.Stack {
  constructor(scope: Construct, config: Config) {
    const {
      github: { repoId, connectionId, branch },
      environmentName,
      region,
      awsAccountId: account,
      s3: { cdkBucket: fileAssetsBucketName },
      prefix: { name, qual: qualifier },
      stage,
      component,
      productName,
      regions,
    } = config
    const stackPrefix = `${name}-${stage}-${component}-cdk-pipeline`
    const stackName = `${stackPrefix}-stack`
    super(scope, stackName, {
      env: {
        account,
        region,
      },
      synthesizer: new cdk.DefaultStackSynthesizer({
        qualifier,
        fileAssetsBucketName,
      }),
      description: `This stack includes resources related to ${productName} ${component}`,
    })

    const pipeline = new CodePipeline(this, stackPrefix, {
      pipelineName: stackPrefix,
      synth: new ShellStep("Synth", {
        env: {
          region,
          component,
          branch,
          stage,
          environmentName,
        },

        input: CodePipelineSource.connection(repoId, branch, {
          connectionArn: `arn:aws:codestar-connections:${region}:${account}:connection/${connectionId}`,
        }),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    })
    const deployWave = pipeline.addWave("wave")
    deployWave.addPre(new ManualApprovalStep("Approval"))
    regions.forEach((region) => {
      deployWave.addStage(
        new BumblebeeAppDeployStage(this, region, config)
      )
    })
  }
}
