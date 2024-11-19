import { Construct } from "constructs";
import { ApiFunction } from "./api-function.construct";
import { ApiResources } from "./api-resources.construct";
import { ApiRole } from "./api-role.construct";

export interface ApiRoutesProps {
  apiResources: ApiResources;
  stackPrefix: string;
  apiRole: ApiRole;
  environment: Record<string, string>;
}

export class ApiIntegration extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { apiRole, stackPrefix, apiResources, environment }: ApiRoutesProps
  ) {
    super(scope, id);
    const { item, query, template, version, versions } = apiResources.resources;

    new ApiFunction(scope, "add-function", {
      stackPrefix,
      name: "add",
      description: "Adds a template to the service",
      apiRole,
      methods: ["POST"],
      resources: template,
      environment,
    });

    new ApiFunction(scope, "get-function", {
      stackPrefix,
      name: "get",
      description:
        "Gets the latest or specific versioned template from the service",
      apiRole,
      methods: ["GET"],
      resources: [...item, ...version],
      environment,
    });

    new ApiFunction(scope, "put-function", {
      stackPrefix,
      name: "put",
      description: "Updates a template in the service",
      apiRole,
      methods: ["PUT"],
      resources: item,
      environment,
    });

    new ApiFunction(scope, "remove-function", {
      stackPrefix,
      name: "remove",
      description: "Deletes a template in the service",
      apiRole,
      methods: ["DELETE"],
      resources: item,
      environment,
    });

    new ApiFunction(scope, "versions-function", {
      stackPrefix,
      name: "versions",
      description: "Gets versions of a template in the service",
      apiRole,
      methods: ["GET", "POST"],
      resources: versions,
      environment,
    });

    new ApiFunction(scope, "query-function", {
      stackPrefix,
      name: "query",
      description: "Gets template from the service based on a query",
      apiRole,
      methods: ["GET", "POST"],
      resources: query,
      environment,
    });
  }
}
