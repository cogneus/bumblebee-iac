import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import * as ssm from "aws-cdk-lib/aws-ssm";
import type { Config } from "../../scripts/config/config.interface";
import { BumblebeeAppDeployStage } from "../stages/bumblebee-app-deploy-iac-stage";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class BumblebeeIacStack extends cdk.Stack {
  constructor(scope: Construct, config: Config) {
    const {
      github: { repoId, connectionId, branch },
      environmentName,
      region,
      awsAccountId: account,
      s3: { cdkBucket: fileAssetsBucketName },
      ssm: { activeStage },
      prefix: { name, qual: qualifier },
      stage,
      defaultDeployStage,
      component,
      productName,
      regions,
      costCenter,
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

    const env = {
      region,
      component,
      branch,
      stage,
      environmentName,
    };

    const rolePolicy = [
      new PolicyStatement({
        sid: "SSMAccess",
        effect: Effect.ALLOW,
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${region}:${account}:parameter/${costCenter}/${productName}/${environmentName}/${stage}/*`,
        ],
      }),
    ];

    const pipeline = new CodePipeline(this, stackPrefix, {
      pipelineName: stackPrefix,
      codeBuildDefaults: {
        rolePolicy,
      },
      synthCodeBuildDefaults: {
        rolePolicy,
      },
      synth: new ShellStep("Synth", {
        env,
        input: source,
        commands: ["npm i", "npm run build", "npx cdk synth"],
      }),
    });
    const deployWave = pipeline.addWave("Deploy");
    deployWave.addPre(new ManualApprovalStep("Approval"));
    regions.forEach((targetRegion) => {
      deployWave.addStage(
        new BumblebeeAppDeployStage(this, targetRegion, config)
      );
    });
    deployWave.addPost(
      new ShellStep("Promote", {
        input: source,
        commands: ["cd ./scripts/promote", "/bin/bash ./promote.sh"],
        env,
      })
    );
  }
}
