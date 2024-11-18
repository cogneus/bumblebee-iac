import { Construct } from "constructs";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import { TokenAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { ApiAuthRole } from "./api-auth-role.construct";

export interface ApiAuthorizerProps {
  stackPrefix: string;
  authRole: ApiAuthRole;
}

export class ApiAuthorizer extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { stackPrefix, authRole }: ApiAuthorizerProps
  ) {
    super(scope, id);
    const authFunctionName = `${stackPrefix}-api-auth`;
    const authFunction = new Function(scope, authFunctionName, {
      functionName: authFunctionName,
      role: authRole.role,
      description: "Gateway authorizer function for templates API",
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
    });

    const authorizerName = `${stackPrefix}-api-authorizer`;
    this.authorizer = new TokenAuthorizer(scope, authorizerName, {
      authorizerName,
      handler: authFunction,
    });
    this.authFunction = authFunction
  }
  public readonly authorizer: TokenAuthorizer;
  public readonly authFunction: Function;
}
