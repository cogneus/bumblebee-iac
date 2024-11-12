import { Token } from 'bumblebee-common'
import { AppRights } from '../../consts'
import { checkReadPermissions, checkWritePermissions } from '../check-permissions'

describe('Check permissions tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const token: Token = {
    email: 'someone@test.com',
    givenName: 'Test',
    legalName: 'User',
    rights: [],
    subject: 'test',
    uid: 'id',
  }

  test('should return true when rights contain read', () => {
    expect(checkReadPermissions({ ...token, rights: [AppRights.read] })).toBe(true)
  })

  test("should return false when rights don't contain read", () => {
    expect(checkReadPermissions({ ...token, rights: [AppRights.write] })).toBe(false)
  })

  test('should return false when rights are empty', () => {
    expect(checkReadPermissions({ ...token, rights: null } as any)).toBe(false)
  })

  test('should return true when rights contain write', () => {
    expect(checkWritePermissions({ ...token, rights: [AppRights.write] })).toBe(true)
  })

  test("should return false when rights don't contain write", () => {
    expect(checkWritePermissions({ ...token, rights: [AppRights.read] })).toBe(false)
  })

  test('should return false when rights are empty', () => {
    expect(checkWritePermissions({ ...token, rights: null } as any)).toBe(false)
  })
})
