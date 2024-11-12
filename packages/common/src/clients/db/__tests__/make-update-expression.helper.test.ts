import { makeUpdateExpression } from '../make-update-expression.helper'

describe('Make update expression tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should match exporession output', () => {
    expect(
      makeUpdateExpression({
        value1: 'test value',
        value2: true,
        value3: 1,
        value4: undefined,
        value5: '',
      })
    ).toMatchSnapshot()
  })
})
