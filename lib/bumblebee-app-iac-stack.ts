import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Config } from '../scripts/config'

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
    } = config
    const stackPrefix = `${name}-${deployStage}-${component}-cdk`
    const stackName = `${stackPrefix}-pipeline-stack`
    super(scope, stackName, {
      env: {
        account,
        region,
      },
      synthesizer: new cdk.DefaultStackSynthesizer({
        qualifier,
        fileAssetsBucketName,
      }),
      description: `This stack includes resources related to ${productName} ${component} ${deployStage} API`,
    })
    const functionName = `${stackPrefix}-api-hw`
    new Function(this, functionName, {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
    })
  }
}
