import { Construct } from 'constructs';
import {
  AuthorizationType,
  Cors,
  LambdaRestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { Config } from '../scripts/config';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { ApiAuthorizer } from './api-authorizer.construct';
import { ApiErrorFunction } from './api-error-function.construct';

export interface ApiProps {
  stackPrefix: string;
  config: Config;
  apiErrorFunction: ApiErrorFunction;
  apiAuthorizer: ApiAuthorizer;
}

export class Api extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { stackPrefix, config, apiErrorFunction, apiAuthorizer }: ApiProps
  ) {
    super(scope, id);

    const { allowedOrigins, awsAccountId, region } = config;
    const restApiName = `${stackPrefix}-cdk-api`;
    const { authFunction, authorizer } = apiAuthorizer;
    this.restApi = new LambdaRestApi(scope, restApiName, {
      restApiName,
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins,
        allowCredentials: true,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: Cors.ALL_METHODS,
      },
      defaultMethodOptions: {
        authorizationType: AuthorizationType.CUSTOM,
        authorizer,
      },
      handler: apiErrorFunction.function,
      proxy: false,
    });

    authFunction.addPermission(`${stackPrefix}-api-auth-permission`, {
      action: 'lambda:InvokeFunction',
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${region}:${awsAccountId}:${this.restApi.restApiId}/authorizers/${authorizer.authorizerId}`,
    });
  }
  public readonly restApi: LambdaRestApi
}
