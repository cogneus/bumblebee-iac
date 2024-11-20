import { Construct } from "constructs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { ApiRole } from "./api-role.construct";
import { Duration } from "aws-cdk-lib";
import path = require("path");
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

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
    const errorFunctionName = `${stackPrefix}-api-error`;
    const fn = new Function(scope, errorFunctionName, {
      functionName: errorFunctionName,
      role: apiRole.role,
      timeout: Duration.seconds(10),
      memorySize: 128,
      description: "Returns errors for unsupported API routes",
      runtime: Runtime.NODEJS_18_X,
      handler: 'error.main',
      code: Code.fromAsset(`${path.resolve(__dirname)}/../../dist`),
      environment,
    });
    this.integration = new HttpLambdaIntegration(`${stackPrefix}-api-error-int`, fn);
  }
  public readonly integration: HttpLambdaIntegration;
}
