export interface ListParams {
  sort?: 'asc' | 'desc'
  includeCurrent?: boolean
  cursor?: string
  limit?: number
  fields?: string[]
}
