import { Resource } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Api } from './api.construct';

export interface ApiResourcesProps {
  stackPrefix: string;
  api: Api;
}

export class ApiResources extends Construct {
  constructor(scope: Construct, id: string, { api }: ApiResourcesProps) {
    super(scope, id);
    const apiVersion = api.restApi.root.addResource('v1');
    const stage = apiVersion.addResource('{stage}');
    const template = this.addResource([apiVersion, stage], ['template']);
    const item = this.addResource(template, ['{id}']);
    const versions = this.addResource(item, ['versions']);
    const version = this.addResource(item, ['{version}']);
    const query = this.addResource(item, ['query', '{group}']);
    this.resources = {
      template,
      item,
      versions,
      version,
      query,
    };
  }
  private addResource(resources: Resource[], paths: string[]): Resource[] {
    return paths.reduce(
      (res, path) => res.map((resource) => resource.addResource(path)),
      resources
    );
  }
  public readonly resources: Record<string, Resource[]>;
}
