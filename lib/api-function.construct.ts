import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, Resource } from 'aws-cdk-lib/aws-apigateway';
import { ApiRole } from './api-role.construct';

export interface ApiFunctionProps {
  stackPrefix: string;
  name: string;
  description: string;
  apiRole: ApiRole;
  resources: Resource[];
  methods: string[];
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
    }: ApiFunctionProps
  ) {
    super(scope, id);
    const functionName = `${stackPrefix}-api-${name}`;
    const lambdaFunction = new Function(scope, functionName, {
      runtime: Runtime.NODEJS_18_X,
      role: apiRole.role,
      handler: 'index.handler',
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
      functionName,
      description,
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
