import { Config } from "../../scripts/config";

export interface LambdaEnv {
  auth: Record<string, string>,
  api: Record<string, string>,
}
export const getLambdaEnv = (config: Config): LambdaEnv => {
  const {
    environmentName,
    region,
    logLevel,
    components,
    route53HostedZone,
    componentName,
    prefix: { name: prefix, ssm: ssmPrefix },
    ssm: { kmsArn },
    secrets: { prefix: secretPrefix, signKey },
  } = config;

  const base = {
    NODE_ENV: environmentName,
    REGION: region,
    LOG_LEVEL: logLevel,
  };

  return {
    auth: {
      ...base,
      RESOURCE_NAME_PREFIX: prefix,
      KMS_ID: `ssm:${kmsArn}`,
      SECRET_ARN_PREFIX: secretPrefix,
      TOKEN_EXPIRY: "1hr",
      SSM_NAME_PREFIX: ssmPrefix,
      SECRET_SIGNING_KEY_NAME: signKey.name,
      TOKEN_AUDIENCE: `${components.auth}-${environmentName}`,
      TOKEN_ISSUER: `${components.auth}.${environmentName}.${route53HostedZone}`,
    },
    api: {
      ...base,
      REQUEST_TIMEOUT: '3000',
      MAX_RETRIES: '3',
      TABLE_TEMPLATES_LIVE: `${prefix}-live-${componentName}-template-table`,
      TABLE_TEMPLATES_STAGING: `${prefix}-staging-${componentName}-template-table`,
      INDEX_GROUPS_LIVE: `${prefix}-live-${componentName}-template-index`,
      INDEX_GROUPS_STAGING: `${prefix}-staging-${componentName}-template-index`,
      DB_LIMIT_MAX: '100',
      DB_LIMIT_DEFAULT: '20',
    },
  };
};
