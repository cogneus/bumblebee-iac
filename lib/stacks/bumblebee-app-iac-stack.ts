import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Config } from "../../scripts/config";
import { Api } from "../constructs/api.construct";
import { ApiErrorFunction } from "../constructs/api-error-function.construct";
import { ApiRole } from "../constructs/api-role.construct";
import { ApiAuthRole } from "../constructs/api-auth-role.construct";
import { ApiAuthorizer } from "../constructs/api-authorizer.construct";
import { ApiResources } from "../constructs/api-resources.construct";
import { ApiIntegration } from "../constructs/api-integration.construct";
import { getLambdaEnv } from "../utils/lambda-env";
import { ApiSSMParams } from "../constructs/api-ssm-params.construct";

export class BumblebeeAppStack extends cdk.Stack {
  constructor(scope: Construct, config: Config) {
    const {
      awsAccountId: account,
      region,
      prefix: { name, qual: qualifier },
      deployStage,
      productName,
      s3: { cdkBucket: fileAssetsBucketName },
      component,
      tags,
    } = config;
    const lambdaEnv = getLambdaEnv(config);
    const stackPrefix = `${name}-${deployStage}-${component}-cdk`;
    const stackName = `${stackPrefix}-pipeline-stack`;
    super(scope, stackName, {
      env: {
        account,
        region,
      },
      synthesizer: new cdk.DefaultStackSynthesizer({
        qualifier,
        fileAssetsBucketName,
      }),
      tags,
      stackName,
      description: `This stack includes resources related to ${productName} ${component} ${deployStage} API`,
    });
    const apiRole = new ApiRole(this, "api-role", { stackPrefix, config });
    const authRole = new ApiAuthRole(this, "api-auth-role", {
      config,
      stackPrefix,
    });
    const apiErrorFunction = new ApiErrorFunction(this, "api-error-function", {
      apiRole,
      stackPrefix,
      environment: lambdaEnv.api,
    });
    const apiAuthorizer = new ApiAuthorizer(this, "api-authorizer", {
      authRole,
      stackPrefix,
      environment: lambdaEnv.auth,
    });
    const api = new Api(this, "api", {
      apiAuthorizer,
      apiErrorFunction,
      config,
      stackPrefix,
    });
    new ApiSSMParams(this, "api-ssm-params", {
      api,
      config,
    });
    const apiResources = new ApiResources(this, "api-resources", {
      api,
      stackPrefix,
    });
    new ApiIntegration(this, "api-integration", {
      apiResources,
      apiRole,
      stackPrefix,
      environment: lambdaEnv.api,
    });
  }
}
