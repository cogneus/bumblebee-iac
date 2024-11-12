import { TableConfig } from './types'

export const getRecordLimit = (
  { itemLimits: { defaultLimit, maxLimit } }: TableConfig,
  limit?: number
) => {
  if (!limit || limit < 1) {
    return defaultLimit
  }

  if (limit > maxLimit) {
    return maxLimit
  }

  return limit
}
