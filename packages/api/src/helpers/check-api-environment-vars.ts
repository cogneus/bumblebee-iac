import { checkEnvironmentVariables } from 'bumblebee-common'

export const checkAPIEnvironmentVars = () =>
  checkEnvironmentVariables([
    'AWS_REGION',
    'REQUEST_TIMEOUT',
    'MAX_RETRIES',
    'TABLE_TEMPLATES_LIVE',
    'TABLE_TEMPLATES_STAGING',
    'INDEX_GROUPS_LIVE',
    'INDEX_GROUPS_STAGING',
    'DB_LIMIT_MAX',
    'DB_LIMIT_DEFAULT',
  ])
