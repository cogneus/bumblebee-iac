export interface QueryParams {
  sort?: 'asc' | 'desc'
  source?: string
  target?: string
  cursor?: string
  limit?: number
  fields?: string[]
}
