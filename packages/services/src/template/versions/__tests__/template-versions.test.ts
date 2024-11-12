import { MissingAttributes } from '../../../exceptions'
import { serviceContext } from '../../__mocks__/service-context.mock'
import { dbTemplateItem, templateVersion } from '../../__mocks__/template.mock'
import { templateVersions } from '../template-versions'

describe('List templates tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  const { id } = templateVersion
  test('query template request should match snapshot', async () => {
    let input
    ;(serviceContext.clients.db?.query as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return {
        items: [dbTemplateItem, dbTemplateItem, dbTemplateItem],
        cursor: 'mock-cursor',
      }
    })
    const result = await templateVersions(serviceContext, id, {
      cursor: 'mock-cursor',
      limit: 1000,
      includeCurrent: true,
    })
    expect({
      input,
      result,
    }).toMatchSnapshot()
  })

  test('query template request with default params should match snapshot', async () => {
    let input
    ;(serviceContext.clients.db?.query as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return {
        items: [dbTemplateItem, dbTemplateItem, dbTemplateItem],
        cursor: 'mock-cursor',
      }
    })
    const result = await templateVersions(serviceContext, id)
    expect({
      input,
      result,
    }).toMatchSnapshot()
  })

  test('request should throw error if id is null', async () => {
    expect(async () => {
      await templateVersions(serviceContext, null as any)
    }).rejects.toThrow(MissingAttributes(['id']))
  })
})
