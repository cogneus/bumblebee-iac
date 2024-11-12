import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import type { Config } from "./config.interface";

export class BumblebeeIacStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps,
    config: Config
  ) {
    super(scope, id, props);
    const {
      github: { repoId, connectionId, branch },
      region,
      awsAccountId,
      prefix: { name },
      stage,
      component,
    } = config;
    const resourceName = `${name}-${stage}-${component}-cdk-pipeline`;
    const pipeline = new CodePipeline(this, resourceName, {
      pipelineName: resourceName,
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.connection(repoId, branch, {
          connectionArn: `arn:aws:codestar-connections:${region}:${awsAccountId}:connection/${connectionId}`,
        }),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });
  }
}
