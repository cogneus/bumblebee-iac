import { Construct } from 'constructs';
import { Architecture, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { ApiAuthRole } from './api-auth-role.construct';
import { Duration } from 'aws-cdk-lib';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ApiAuthorizerProps {
  stackPrefix: string;
  authRole: ApiAuthRole;
  environment: Record<string, string>;
}

export class ApiAuthorizer extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { stackPrefix, authRole, environment }: ApiAuthorizerProps
  ) {
    super(scope, id);
    const authFunctionName = `${stackPrefix}-api-auth`;
    const authFunction = new NodejsFunction(scope, authFunctionName, {
      functionName: authFunctionName,
      role: authRole.role,
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(10),
      memorySize: 128,
      description: 'Gateway authorizer function for templates API',
      runtime: Runtime.NODEJS_18_X,
      environment,
      handler: 'main',
      entry: path.join(__dirname, `../../packages/auth/src/handlers/authorizer.ts`),
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
