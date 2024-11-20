import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, Resource } from 'aws-cdk-lib/aws-apigateway';
import { ApiRole } from './api-role.construct';
import { Duration } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');
import { Api } from './api.construct';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';

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
    const lambdaFunction = new NodejsFunction(scope, functionName, {
      runtime: Runtime.NODEJS_18_X,
      role: apiRole.role,
      timeout: Duration.seconds(10),
      memorySize: 512,
      functionName,
      description,
      environment,
      handler: 'main',
      entry: path.join(__dirname, `../../packages/api/src/handlers/${entry}.ts`),
    });

    this.integration = new HttpLambdaIntegration(`${functionName}-int`, lambdaFunction);
  }
  public readonly integration: HttpLambdaIntegration
}
