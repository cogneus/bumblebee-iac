import { LambdaRestApi, Resource } from "aws-cdk-lib/aws-apigateway";

const addRoute = (resources: Resource[], paths: string[]): Resource[] =>
  paths.reduce((res, path) => res.map(resource => resource.addResource(path) ), resources)

export const addAPIRoutes = (api: LambdaRestApi) => {
    const apiVersion = api.root.addResource('v1')
    const stage = apiVersion.addResource('{stage}')  
    const template = addRoute([apiVersion, stage], ['template'])
    const item = addRoute(template, ['{id}']) 
    const versions = addRoute(item, ['versions']) 
    const version = addRoute(item, ['{version}']) 
    const query = addRoute(item, ['query', '{group}']) 
    return {
      template,
      item,
      versions,
      version,
      query
    }
}
