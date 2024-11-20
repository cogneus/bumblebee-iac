import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import * as ssm from "aws-cdk-lib/aws-ssm";
import type { Config } from "../../scripts/config/config.interface";
import { BumblebeeAppDeployStage } from "../stages/bumblebee-app-deploy-iac-stage";
import { APIPipeline } from "../constructs/api-pipeline.construct";

export class BumblebeeIacStack extends cdk.Stack {
  constructor(scope: Construct, config: Config) {
    const {
      github: { repoId, connectionId, branch },
      environmentName,
      region,
      awsAccountId: account,
      s3: { cdkBucket: fileAssetsBucketName },
      ssm: { activeStage },
      prefix: { name, qual: qualifier, ssm: ssmPrefix },
      stage,
      defaultDeployStage,
      component,
      productName,
      regions,
    } = config;
    const stackPrefix = `${name}-${stage}-${component}-cdk-pipeline`;
    const stackName = `${stackPrefix}-stack`;
    super(scope, stackName, {
      env: {
        account,
        region,
      },
      synthesizer: new cdk.DefaultStackSynthesizer({
        qualifier,
        fileAssetsBucketName,
      }),
      stackName,
      description: `This stack includes resources related to ${productName} ${component}`,
    });

    new ssm.StringParameter(this, `${stackPrefix}-deploystage`, {
      parameterName: `${activeStage}/cdk-${component}`,
      stringValue: defaultDeployStage,
      description: "The current live stage for API deployment",
      tier: ssm.ParameterTier.STANDARD,
    });

    const source = CodePipelineSource.connection(repoId, branch, {
      connectionArn: `arn:aws:codestar-connections:${region}:${account}:connection/${connectionId}`,
    });

    const { deployWave } = new APIPipeline(this, "api-pipeline", {
      stackPrefix,
      config,
      source,
    });
    deployWave.addPre(new ManualApprovalStep("Approval"));
    regions.forEach((targetRegion) => {
      const deployStage = deployWave.addStage(
        new BumblebeeAppDeployStage(this, targetRegion, config)
      );
      deployStage.addPost(
        new ShellStep(`Test`, {
          input: source,
          commands: ["cd ./scripts/test", "/bin/bash ./test.sh"],
          env: {
            region,
            component,
            branch,
            stage,
            environmentName,
          },
        })
      );
    });
    deployWave.addPost(
      new ShellStep("Promote", {
        input: source,
        commands: ["cd ./scripts/promote", "/bin/bash ./promote.sh"],
        env: {
          region,
          component,
          branch,
          stage,
          environmentName,
        },
      })
    );
  }
}
