/**
 * EventData used for standardised message structure
 * @member {string?} eventCode will be extracted and included in log transform data
 * @member {string?} message will extracted and included as 'message' in log transform data
 */
export interface EventData extends Record<string, any> {
  eventCode?: string
  message?: string
}
