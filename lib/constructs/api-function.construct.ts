import { Construct } from 'constructs';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, Resource } from 'aws-cdk-lib/aws-apigateway';
import { ApiRole } from './api-role.construct';
import { Duration } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');

export interface ApiFunctionProps {
  stackPrefix: string;
  name: string;
  description: string;
  apiRole: ApiRole;
  resources: Resource[];
  methods: string[];
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
      resources,
      methods,
      environment,
      entry,
    }: ApiFunctionProps
  ) {
    super(scope, id);
    const functionName = `${stackPrefix}-api-${name}`;
    const lambdaFunction = new NodejsFunction(scope, functionName, {
      runtime: Runtime.NODEJS_18_X,
      role: apiRole.role,
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(10),
      memorySize: 512,
      functionName,
      description,
      environment,
      handler: 'main',
      entry: path.join(__dirname, `../../packages/api/src/handlers/${entry}.ts`),
    });

    const integration = new LambdaIntegration(lambdaFunction);

    resources.forEach((resource) => {
      methods.forEach((method) => {
        resource.addMethod(method, integration, {
          apiKeyRequired: false,
        });
      });
    });
  }
}
