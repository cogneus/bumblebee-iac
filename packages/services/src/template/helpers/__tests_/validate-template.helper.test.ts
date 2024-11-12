import { EmptyRequest, MissingAttributes } from '../../../exceptions'
import { mandatoryKeys, validateTemplate } from '../validate-template.helper'

describe('Validate template tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('No error should be thrown', () => {
    expect(() =>
      validateTemplate({
        group: 'test-group',
        source: 'test-source',
        target: 'test-target',
        template: {},
      })
    ).not.toThrow()
  })

  test('Missing attrbutes should be thrown', () => {
    expect(() => validateTemplate({} as any)).toThrow(MissingAttributes(mandatoryKeys))
  })

  test('EmptyRequest should be thrown', () => {
    expect(() => validateTemplate(null)).toThrow(EmptyRequest())
  })
})
