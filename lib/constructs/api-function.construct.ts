import { Construct } from 'constructs';
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { ApiRole } from './api-role.construct';
import { Duration } from 'aws-cdk-lib';
import path = require('path');
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export interface ApiFunctionProps {
  stackPrefix: string;
  name: string;
  description: string;
  apiRole: ApiRole;
  environment: Record<string, string>
  entry: string;
}

export class ApiFunction extends Construct {
  constructor(
    scope: Construct,
    id: string,
    {
      stackPrefix,
      name,
      description,
      apiRole,
      environment,
      entry,
    }: ApiFunctionProps
  ) {
    super(scope, id);
    const functionName = `${stackPrefix}-api-${name}`;
    const lambdaFunction = new Function(scope, functionName, {
      runtime: Runtime.NODEJS_18_X,
      role: apiRole.role,
      timeout: Duration.seconds(10),
      memorySize: 512,
      functionName,
      description,
      environment,
      handler: `${entry}.main`,
      code: Code.fromAsset(`${path.resolve(__dirname)}/../../dist`),
    });

    this.integration = new HttpLambdaIntegration(`${functionName}-int`, lambdaFunction);
  }
  public readonly integration: HttpLambdaIntegration
}
