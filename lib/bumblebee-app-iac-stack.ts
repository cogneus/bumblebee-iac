import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Cors,
  LambdaIntegration,
  LambdaRestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Config } from "../scripts/config";
import { addAPI, Api } from "./api.construct";
import { ApiErrorFunction } from "./api-error-function.construct";
import { ApiRole } from "./api-role.construct";
import { ApiAuthRole } from "./api-auth-role.construct";
import { ApiAuthorizer } from "./api-authorizer.construct";
import { ApiResources } from "./api-resources.construct";
import { ApiIntegration } from "./api-integration.construct";

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
    });
    const apiAuthorizer = new ApiAuthorizer(this, "api-authorizer", {
      authRole,
      stackPrefix,
    });
    const api = new Api(this, "api", {
      apiAuthorizer,
      apiErrorFunction,
      config,
      stackPrefix,
    });
    const apiResources = new ApiResources(this, "api-resources", {
      api,
      stackPrefix,
    });
    new ApiIntegration(this, 'api-integration', {
      apiResources,
      apiRole,
      stackPrefix
    })
  }
}
