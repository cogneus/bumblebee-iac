import { MissingAttributes } from '../../../exceptions'
import { serviceContext } from '../../__mocks__/service-context.mock'
import { dbTemplateItem, templateItem } from '../../__mocks__/template.mock'
import { queryTemplates } from '../query-templates'

describe('Query templates tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  const { group } = templateItem
  test('query template request should match snapshot', async () => {
    let input
    ;(serviceContext.clients.db?.query as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return {
        items: [dbTemplateItem, dbTemplateItem, dbTemplateItem],
        cursor: 'mock-cursor',
      }
    })
    const result = await queryTemplates(serviceContext, group, {
      cursor: 'mock-cursor',
      limit: 1000,
      source: 'mock-source',
      target: 'mock-target',
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
    const result = await queryTemplates(serviceContext, group)
    expect({
      input,
      result,
    }).toMatchSnapshot()
  })

  test('request should throw error if id is null', async () => {
    expect(async () => {
      await queryTemplates(serviceContext, null as any)
    }).rejects.toThrow(MissingAttributes(['group']))
  })
})
