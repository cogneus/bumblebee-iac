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

export interface ApiAuthRoleProps {
  stackPrefix: string;
  config: Config;
}

export class ApiAuthRole extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { stackPrefix, config }: ApiAuthRoleProps
  ) {
    super(scope, id);
    const {
      regionCode,
      secrets: { prefix },
    } = config;

    const roleName = `${stackPrefix}-${regionCode}-auth-role`;

    const signPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['secretsmanager:GetSecretValue'],
          resources: [`${prefix}-auth-token-sign-key*`],
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
        [`${stackPrefix}-${regionCode}-sign-key-policy`]: signPolicy,
        [`${stackPrefix}-${regionCode}-kms-policy`]: kmsPolicy,
        [`${stackPrefix}-${regionCode}-tracing-policy`]: tracingPolicy,
      },
    });
  }
  public readonly role: Role;
}
