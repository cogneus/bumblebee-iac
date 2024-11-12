export type ErrorAction = 'no-retry' | 'ignore'
export type ErrorActionCollection = { [key in string]?: ErrorAction }
