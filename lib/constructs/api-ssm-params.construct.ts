import { Construct } from "constructs";
import { Api } from "./api.construct";
import { Config } from "../../scripts/config";
import { ParameterTier, StringParameter } from "aws-cdk-lib/aws-ssm";

export interface ApiSSMParamsProps {
  config: Config;
  api: Api;
}

export class ApiSSMParams extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { api, config }: ApiSSMParamsProps
  ) {
    super(scope, id);
    const {
      region,
      prefix: { ssm },
      deployStage,
      componentName,
    } = config;
    const resourceSsmPrefix = `${ssm}/${deployStage}/${componentName}`;
    const { apiId } = api.httpApi;
    const apiIdParamName = `${resourceSsmPrefix}/cdk/api/id`;
    new StringParameter(this, apiIdParamName, {
      parameterName: apiIdParamName,
      stringValue: apiId,
      description: `The id for the ${deployStage} API`,
      tier: ParameterTier.STANDARD,
    });

    const apiDomainParamName = `${resourceSsmPrefix}/cdk/api/domain`;
    new StringParameter(this, apiDomainParamName, {
      parameterName: apiDomainParamName,
      stringValue: `${apiId}.execute-api.${region}.amazonaws.com`,
      description: `The domain for the ${deployStage} API`,
      tier: ParameterTier.STANDARD,
    });
  }
}
