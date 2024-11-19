declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string
    LOG_LEVEL: string
    AWS_REGION: string
    REQUEST_TIMEOUT: number
    MAX_RETRIES: number
    TABLE_TEMPLATES_LIVE: string
    TABLE_TEMPLATES_STAGING: string
    INDEX_GROUPS_LIVE: string
    INDEX_GROUPS_STAGING: string
    DB_LIMIT_MAX: string
    DB_LIMIT_DEFAULT: string
  }
}
