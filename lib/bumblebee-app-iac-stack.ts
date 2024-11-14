import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import { Cors, LambdaIntegration, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Config } from "../scripts/config";

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
      allowedOrigins,
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
    const functionName = `${stackPrefix}-api-hw`;
    const hwFunction = new Function(this, functionName, {
      functionName,
      description: "test function",
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
    });
    const restApiName = `${stackPrefix}-cdk-api`;
    const api = new LambdaRestApi(this, restApiName, {
      restApiName,
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins,
        allowCredentials: true,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: Cors.ALL_METHODS,
      },
      handler: hwFunction,
      proxy: false,
    });

    const version = api.root.addResource('v1') 
    const template = version.addResource('template') 
    const stage = version.addResource('{stage}') 
    const templateStaging = stage.addResource('template') 
    const hwAPI = template.addResource(`hw`)
    const hwStagingAPI = templateStaging.addResource(`hw`)
    const hwIntegration = new LambdaIntegration(hwFunction);
    
    hwAPI.addMethod('GET', hwIntegration, {
      apiKeyRequired: false,
    });
    hwAPI.addMethod('POST', hwIntegration, {
      apiKeyRequired: false,
    });
    hwStagingAPI.addMethod('GET', hwIntegration, {
      apiKeyRequired: false,
    });
    hwStagingAPI.addMethod('POST', hwIntegration, {
      apiKeyRequired: false,
    });
  }
}
