import { TemplateVersion } from '../../../types'
import {
  makePK,
  makePKGSIGroup,
  makeSK,
  makeSKCurrent,
  makeSKGSIModified,
  removeKeyInfo,
} from '../keys.helper'

describe('Keys helper tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const item: TemplateVersion = {
    id: 'test-id',
    version: 1,
    created: '2023-01-01T00:00:00Z',
    modified: '2023-01-01T00:00:00Z',
    group: 'test-group',
    source: 'test-source',
    target: 'test-target',
    template: {},
  }

  test('makePK should match snapshot', () => {
    expect(makePK(item)).toMatchSnapshot()
  })

  test('makeSK should match snapshot', () => {
    expect(makeSK(item)).toMatchSnapshot()
  })

  test('makePKGSIGroup should match snapshot', () => {
    expect(makePKGSIGroup(item)).toMatchSnapshot()
  })

  test('makeSKCurrent should match snapshot', () => {
    expect(makeSKCurrent()).toMatchSnapshot()
  })

  test('makeSKGSIModified should match snapshot', () => {
    expect(makeSKGSIModified(item)).toMatchSnapshot()
  })

  test('removeKeyInfo should match snapshot', () => {
    expect(
      removeKeyInfo({
        PK: makePK(item),
        SK: makeSK(item),
        PKGSI: makePKGSIGroup(item),
        SKGSI: makeSKGSIModified(item),
        ...item,
      })
    ).toMatchSnapshot()
  })
})
