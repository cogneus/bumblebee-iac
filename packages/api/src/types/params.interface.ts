export type TemplatesParams<T = Record<string, any>> = T & {
  stage?: 'staging' | 'live'
  id?: string
  version?: number
  group?: string
}
