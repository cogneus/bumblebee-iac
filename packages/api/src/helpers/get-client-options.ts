import { ClientOptions } from 'bumblebee-common'
import { env } from 'process'
import { TemplatesParams } from '../types'

export const getClientOptions = ({ stage }: TemplatesParams): ClientOptions => {
  const {
    TABLE_TEMPLATES_LIVE,
    TABLE_TEMPLATES_STAGING,
    INDEX_GROUPS_LIVE,
    INDEX_GROUPS_STAGING,
    DB_LIMIT_DEFAULT,
    DB_LIMIT_MAX,
  } = env

  const tables = {
    live: TABLE_TEMPLATES_LIVE,
    staging: TABLE_TEMPLATES_STAGING,
  }

  const indices = {
    live: INDEX_GROUPS_LIVE,
    staging: INDEX_GROUPS_STAGING,
  }
  return {
    db: {
      maxAttempts: 1,
      region: '',
      requestTimeout: 3000,
      tables: {
        templates: {
          name: tables[stage || 'live'],
          itemLimits: {
            maxLimit: +DB_LIMIT_MAX,
            defaultLimit: +DB_LIMIT_DEFAULT,
          },
          indices: {
            groups: {
              name: indices[stage || 'live'],
            },
          },
        },
      },
    },
  }
}
