import { Construct } from 'constructs';
import { Config } from '../../scripts/config';
import {
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';

export interface ApiRoleProps {
  stackPrefix: string;
  config: Config;
}

export class ApiRole extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { stackPrefix, config }: ApiRoleProps
  ) {
    super(scope, id);
    const {
      regionCode,
      awsAccountId,
      prefix: { name },
      componentName,
    } = config;

    const roleName = `${stackPrefix}-${regionCode}-api-role`;

    const ddbPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'dynamodb:PutItem',
            'dynamodb:GetItem',
            'dynamodb:DeleteItem',
            'dynamodb:UpdateItem',
            'dynamodb:Query',
            'dynamodb:BatchWriteItem',
          ],
          resources: [
            `arn:aws:dynamodb:*:${awsAccountId}:table/${name}-*-${componentName}-template-table`,
            `arn:aws:dynamodb:*:${awsAccountId}:table/${name}-*-${componentName}-template-table/*`,
          ],
        }),
      ],
    });

    const kmsPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['kms:Decrypt', 'kms:GenerateDataKey'],
          resources: [`*`],
        }),
      ],
    });

    const tracingPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'xray:PutTraceSegments',
            'xray:PutTelemetryRecords',
            'xray:GetSamplingRules',
            'xray:GetSamplingTargets',
            'xray:GetSamplingStatisticSummaries',
          ],
          resources: [`*`],
        }),
      ],
    });
    this.role = new Role(scope, roleName, {
      roleName,
      path: '/',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole'
        ),
      ],
      inlinePolicies: {
        [`${stackPrefix}-${regionCode}-ddb-policy`]: ddbPolicy,
        [`${stackPrefix}-${regionCode}-kms-policy`]: kmsPolicy,
        [`${stackPrefix}-${regionCode}-tracing-policy`]: tracingPolicy,
      },
    });
  }
  public readonly role: Role;
}
