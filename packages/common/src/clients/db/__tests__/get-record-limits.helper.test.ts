import { getRecordLimit } from '../get-record-limit.helper'
import { TableConfig } from '../types'

const tableConfig: TableConfig = {
  name: 'test',
  indices: {},
  itemLimits: {
    defaultLimit: 20,
    maxLimit: 100,
  },
}
describe('Get record limit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const limits = [0, -1, null, undefined, 20, 100, 101, 1000]
  test('should match limit', () => {
    const newLimits = limits.map((limit) => getRecordLimit(tableConfig, limit as any))
    expect(newLimits).toMatchSnapshot()
  })
})
