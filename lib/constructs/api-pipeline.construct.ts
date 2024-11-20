import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  Wave,
} from "aws-cdk-lib/pipelines";
import type { Config } from "../../scripts/config/config.interface";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export interface APIPipelineProps {
  stackPrefix: string;
  config: Config;
  source: CodePipelineSource;
}

export class APIPipeline extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { config, stackPrefix, source }: APIPipelineProps
  ) {
    super(scope, id);
    const {
      github: { branch },
      environmentName,
      region,
      awsAccountId: account,
      prefix: { ssm: ssmPrefix },
      stage,
      component,
      regions,
      deployStages,
      route53HostedZone,
      productRef,
    } = config;

    const ssmPolicy = new PolicyStatement({
      sid: "SSMAccess",
      effect: Effect.ALLOW,
      actions: ["ssm:GetParameter", "ssm:GetParameters"],
      resources: [
        `arn:aws:ssm:${region}:${account}:parameter${ssmPrefix}/${stage}/*`,
        ...Object.values(deployStages).map(
          (deployStage) =>
            `arn:aws:ssm:${region}:${account}:parameter${ssmPrefix}/${deployStage}/*`
        ),
      ],
    });

    const apiPolicy = new PolicyStatement({
      sid: "APIAccess",
      effect: Effect.ALLOW,
      actions: ["apigateway:GET", "apigateway:PATCH"],
      resources: regions.reduce<string[]>(
        (resources, targetRegion) => [
          ...resources,
          `arn:aws:apigateway:${targetRegion}::/domainnames/${environmentName}.${productRef}.${route53HostedZone}/apimappings`,
          `arn:aws:apigateway:${targetRegion}::/domainnames/${environmentName}.${productRef}.${route53HostedZone}/apimappings/*`,
        ],
        []
      ),
    });

    const pipeline = new CodePipeline(this, stackPrefix, {
      pipelineName: stackPrefix,
      codeBuildDefaults: {
        rolePolicy: [ssmPolicy, apiPolicy],
      },
      synthCodeBuildDefaults: {
        rolePolicy: [ssmPolicy],
      },
      synth: new ShellStep("Synth", {
        env: {
          region,
          component,
          branch,
          stage,
          environmentName,
        },
        input: source,
        commands: ["npm i", "npm run build", "npx cdk synth"],
      }),
    });
    this.deployWave = pipeline.addWave("Deploy");
  }
  public readonly deployWave: Wave;
}
