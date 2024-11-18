import { Construct } from "constructs";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import { ApiRole } from "./api-role.construct";

export interface ApiErrorFunctionProps {
  stackPrefix: string;
  apiRole: ApiRole;
}

export class ApiErrorFunction extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { stackPrefix, apiRole }: ApiErrorFunctionProps
  ) {
    super(scope, id);
    const errorFunctionName = `${stackPrefix}-api-error`;
    this.function = new Function(scope, errorFunctionName, {
      functionName: errorFunctionName,
      role: apiRole.role,
      description: "Returns errors for unsupported API routes",
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
    });
  }
  public readonly function: Function
}
