import { Construct } from 'constructs';
import { ApiRole } from './api-role.construct';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { CoreFunction } from './core-function.construct';

export interface ApiFunctionProps {
  stackPrefix: string;
  name: string;
  entry: string;
  description: string;
  apiRole: ApiRole;
  environment: Record<string, string>
}

export class ApiFunction extends Construct {
  constructor(
    scope: Construct,
    id: string,
    {
      stackPrefix,
      description,
      apiRole,
      environment,
      name,
      entry,
    }: ApiFunctionProps
  ) {
    super(scope, id);
    const functionName = `${stackPrefix}-api-${name}`;
    const lambdaFunction = new CoreFunction(scope, functionName, {
      role: apiRole.role,
      functionName,
      description,
      environment,
      entry,
    });

    this.integration = new HttpLambdaIntegration(`${functionName}-int`, lambdaFunction);
  }
  public readonly integration: HttpLambdaIntegration
}
