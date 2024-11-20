import { Construct } from "constructs";
import { ApiFunction } from "./api-function.construct";
import { ApiRole } from "./api-role.construct";
import { Api } from "./api.construct";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";

export interface ApiRoutesProps {
  api: Api;
  stackPrefix: string;
  apiRole: ApiRole;
  environment: Record<string, string>;
}

export class ApiIntegration extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { apiRole, stackPrefix, api, environment }: ApiRoutesProps
  ) {
    super(scope, id);
    const { httpApi } = api;

    this.addRoutes(
      httpApi,
      ["", "/{id}/{version}"],
      [HttpMethod.POST],
      new ApiFunction(scope, "add-function", {
        stackPrefix,
        name: "add",
        description: "Adds a template to the service",
        apiRole,
        environment,
        entry: "add-template",
      })
    );

    this.addRoutes(
      httpApi,
      ["/{id}"],
      [HttpMethod.GET],
      new ApiFunction(scope, "get-function", {
        stackPrefix,
        name: "get",
        description:
          "Gets the latest or specific versioned template from the service",
        apiRole,
        environment,
        entry: "get-template",
      })
    );
    this.addRoutes(
      httpApi,
      ["/{id}"],
      [HttpMethod.PUT],
      new ApiFunction(scope, "put-function", {
        stackPrefix,
        name: "put",
        description: "Updates a template in the service",
        apiRole,
        environment,
        entry: "update-template",
      })
    );
    this.addRoutes(
      httpApi,
      ["/{id}"],
      [HttpMethod.DELETE],
      new ApiFunction(scope, "remove-function", {
        stackPrefix,
        name: "remove",
        description: "Deletes a template in the service",
        apiRole,
        environment,
        entry: "remove-template",
      })
    );
    this.addRoutes(
      httpApi,
      ["/{id}/versions"],
      [HttpMethod.GET, HttpMethod.POST],
      new ApiFunction(scope, "remove-function", {
        stackPrefix,
        name: "versions",
        description: "Gets versions of a template in the service",
        apiRole,
        environment,
        entry: "template-versions",
      })
    );

    this.addRoutes(
      httpApi,
      ["/query"],
      [HttpMethod.GET, HttpMethod.POST],
      new ApiFunction(scope, "remove-function", {
        stackPrefix,
        name: "query",
        description: "Gets template from the service based on a query",
        apiRole,
        environment,
        entry: "query-template",
      })
    );
  }

  private addRoutes(
    httpApi: HttpApi,
    paths: string[],
    methods: HttpMethod[],
    { integration }: ApiFunction
  ) {
    const rootPath = "/v1/template";
    const rootStagedPath = "/v1/{stage}/template";
    paths.forEach((path) => {
      httpApi.addRoutes({
        path: `${rootPath}${path}`,
        methods,
        integration,
      });
      httpApi.addRoutes({
        path: `${rootStagedPath}${path}`,
        methods,
        integration,
      });
    });
  }
}
