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
      regionCodes,
      secrets: { prefix: secretPrefix }
    } = config;
    const deployStageNames = Object.values(deployStages)
    const ssmPolicy = new PolicyStatement({
      sid: "SSMAccess",
      effect: Effect.ALLOW,
      actions: ["ssm:GetParameter", "ssm:GetParameters", "ssm:PutParameter"],
      resources: regions.reduce<string[]>(
        (resources, targetRegion) => [
          ...resources,
          `arn:aws:ssm:${targetRegion}:${account}:parameter${ssmPrefix}/${stage}/*`,
          ...deployStageNames.reduce<string[]>(
            (resources, targetStage) => [
              ...resources,
              `arn:aws:ssm:${targetRegion}:${account}:parameter${ssmPrefix}/${targetStage}/*`
            ],
            []
          )
        ],
        []
      ),
    });

    const secretsPolicy = new PolicyStatement({
      sid: "SecretsAccess",
      effect: Effect.ALLOW,
      actions: ["secretsmanager:GetSecretValue"],
      resources: [`${secretPrefix}-auth-user-tokens*`],
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
          `arn:aws:apigateway:${targetRegion}::/domainnames/${regionCodes[targetRegion]}.${environmentName}.${productRef}.${route53HostedZone}/apimappings`,
          `arn:aws:apigateway:${targetRegion}::/domainnames/${regionCodes[targetRegion]}.${environmentName}.${productRef}.${route53HostedZone}/apimappings/*`,          
          ...deployStageNames.reduce<string[]>(
            (resources, targetStage) => [
              ...resources,
              `arn:aws:apigateway:${targetRegion}::/domainnames/${targetStage}.${environmentName}.${productRef}.${route53HostedZone}/apimappings`,
              `arn:aws:apigateway:${targetRegion}::/domainnames/${targetStage}.${environmentName}.${productRef}.${route53HostedZone}/apimappings/*`,
              
            ],
            []
          )
        ],
        []
      ),
    });

    const pipeline = new CodePipeline(this, stackPrefix, {
      pipelineName: stackPrefix,
      codeBuildDefaults: {
        rolePolicy: [ssmPolicy, apiPolicy, secretsPolicy],
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
