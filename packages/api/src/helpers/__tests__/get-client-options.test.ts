import { getClientOptions } from '../get-client-options'

describe('Check permissions tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      TABLE_TEMPLATES_LIVE: 'live-table',
      TABLE_TEMPLATES_STAGING: 'live-table',
      INDEX_GROUPS_LIVE: 'live-index',
      INDEX_GROUPS_STAGING: 'staging-index',
    } as any
  })

  test('should match client options for staging', () => {
    expect(getClientOptions({ stage: 'staging' })).toMatchSnapshot()
  })

  test('should match client options for live', () => {
    expect(getClientOptions({ stage: 'live' })).toMatchSnapshot()
    expect(getClientOptions({})).toMatchSnapshot()
  })
})
