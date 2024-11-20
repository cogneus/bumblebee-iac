import { Construct } from 'constructs';
import {
  AuthorizationType,
  Cors,
  LambdaRestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { Config } from '../../scripts/config';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { ApiAuthorizer } from './api-authorizer.construct';
import { ApiErrorFunction } from './api-error-function.construct';
import { CorsHttpMethod, HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';

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
    const apiName = `${stackPrefix}-api`;
    const { authFunction, authorizer } = apiAuthorizer;
    this.httpApi = new HttpApi(scope, apiName, {
      apiName,
      corsPreflight:{
        allowOrigins: allowedOrigins,
        allowCredentials: true,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
      },
      defaultIntegration: apiErrorFunction.integration,
      defaultAuthorizer: authorizer,
      createDefaultStage: true,
    });

    authFunction.addPermission(`${stackPrefix}-api-auth-permission`, {
      action: 'lambda:InvokeFunction',
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${region}:${awsAccountId}:${this.httpApi.apiId}/authorizers/${authorizer.authorizerId}`,
    });
  }
  public readonly httpApi: HttpApi
}
