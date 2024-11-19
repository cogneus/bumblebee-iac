import { Construct } from "constructs";
import { Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { ApiRole } from "./api-role.construct";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Duration } from "aws-cdk-lib";
import path = require("path");

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
    this.function = new NodejsFunction(scope, errorFunctionName, {
      functionName: errorFunctionName,
      role: apiRole.role,
      timeout: Duration.seconds(10),
      memorySize: 128,
      description: "Returns errors for unsupported API routes",
      runtime: Runtime.NODEJS_18_X,
      handler: "main",
      entry: path.join(__dirname, `../../packages/api/src/handlers/error.ts`),
      environment,
    });
  }
  public readonly function: Function;
}
