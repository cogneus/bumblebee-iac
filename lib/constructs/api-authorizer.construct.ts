import { Construct } from 'constructs';
import { Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { ApiAuthRole } from './api-auth-role.construct';
import { Duration } from 'aws-cdk-lib';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { CoreFunction } from './core-function.construct';

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
    const functionName = `${stackPrefix}-api-auth`;
    const authFunction = new CoreFunction(scope, functionName, {
      functionName,
      role: authRole.role,
      memorySize: 128,
      description: 'Gateway authorizer function for templates API',
      environment,
      entry: 'authorizer',
    });

    const authorizerName = `${stackPrefix}-api-authorizer`;

    this.authorizer = new HttpLambdaAuthorizer(authorizerName, authFunction, {
      authorizerName,
      resultsCacheTtl: Duration.minutes(5),
      identitySource: ['$request.header.Authorization'],
      responseTypes: [HttpLambdaResponseType.SIMPLE]
    });
    this.authFunction = authFunction
  }
  public readonly authorizer: HttpLambdaAuthorizer;
  public readonly authFunction: Function;
}
