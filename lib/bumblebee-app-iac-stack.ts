import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import { Cors, LambdaIntegration, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Config } from "../scripts/config";
import { addAPI } from "./add-api";

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
    addAPI(this, stackPrefix, config)
  }
}
