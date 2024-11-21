import { Construct } from "constructs";
import { ApiRole } from "./api-role.construct";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { CoreFunction } from "./core-function.construct";

export interface ApiErrorFunctionProps {
  stackPrefix: string;
  apiRole: ApiRole;
  environment: Record<string, string>;
}

export class ApiErrorFunction extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { stackPrefix, apiRole, environment }: ApiErrorFunctionProps
  ) {
    super(scope, id);
    const functionName = `${stackPrefix}-api-error`;
    const fn = new CoreFunction(scope, functionName, {
      functionName,
      role: apiRole.role,
      memorySize: 128,
      description: "Returns errors for unsupported API routes",
      entry: 'error',
      environment,
    });
    this.integration = new HttpLambdaIntegration(`${stackPrefix}-api-error-int`, fn);
  }
  public readonly integration: HttpLambdaIntegration;
}
