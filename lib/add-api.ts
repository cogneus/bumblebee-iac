import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function, FunctionProps, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import { Cors, Integration, LambdaIntegration, LambdaRestApi, Resource } from "aws-cdk-lib/aws-apigateway";
import { Config } from "../scripts/config";
import { addAPIFunction } from "./add-api-function";
import { addAPIRoutes } from "./add-api-routes";

const addMethod = (integration: Integration, methods: string[], resources: Resource[]) => {
  resources.forEach(resource => {
    methods.forEach(method => {
      resource.addMethod(method, integration, {
        apiKeyRequired: false,
      });
    })
  });

}

export const addAPI = (scope: Construct, stackPrefix: string, config: Config) => {
    const {
      allowedOrigins,
    } = config;
    const functionName = `${stackPrefix}-api-error`;
    const errorFunction = new Function(scope, functionName, {
      functionName,
      description: "test function",
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
    });
    const restApiName = `${stackPrefix}-cdk-api`;
    const api = new LambdaRestApi(scope, restApiName, {
      restApiName,
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins,
        allowCredentials: true,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: Cors.ALL_METHODS,
      },
      handler: errorFunction,
      proxy: false,
    });

    const {
      item,
      query,
      template,
      version,
      versions
    } = addAPIRoutes(api)

    const addItem = addAPIFunction(scope, stackPrefix, 'add', 'Adds a template to the service')
    addMethod(addItem, ['POST'], template)

    const getItem = addAPIFunction(scope, stackPrefix, 'get', 'Gets a template from the service')
    addMethod(getItem, ['GET'], item)

    const putItem = addAPIFunction(scope, stackPrefix, 'put', 'Updates a template in the service')
    addMethod(putItem, ['PUT'], item)

    const deleteItem = addAPIFunction(scope, stackPrefix, 'put', 'Deletes a template in the service')
    addMethod(deleteItem, ['DELETE'], item)

    const getVersion = addAPIFunction(scope, stackPrefix, 'get', 'Gets a template version from the service')
    addMethod(getVersion, ['GET'], version)

    const getVersions = addAPIFunction(scope, stackPrefix, 'get', 'Gets versions of a template in the service')
    addMethod(getVersions, ['GET', 'POST'], versions)

    const queryItems = addAPIFunction(scope, stackPrefix, 'get', 'Gets template from the service based on a query')
    addMethod(queryItems, ['GET', 'POST'], query)
    
}
