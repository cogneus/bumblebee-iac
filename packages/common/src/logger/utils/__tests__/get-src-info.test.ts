import { getSrcInfo } from '../get-src-info'

describe('Get source info log utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should apply simple stringify for non-dev', () => {
    const file = getSrcInfo()?.file
    function testSrc() {
      function testSrcInner() {
        return getSrcInfo(1)
      }
      return testSrcInner()
    }
    const info = testSrc()
    expect(info).toEqual({
      file,
      func: 'testSrc',
      line: 14,
      position: 14,
    })
  })
})
