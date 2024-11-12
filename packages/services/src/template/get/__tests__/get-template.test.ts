import { MissingAttributes, TemplateNotFound } from '../../../exceptions'
import { serviceContext } from '../../__mocks__/service-context.mock'
import { dbTemplateItem } from '../../__mocks__/template.mock'
import { getTemplate } from '../get-template'
import { NIL as emptyId } from 'uuid'

describe('Get template tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  test('latest template request should match snapshot', async () => {
    let input = null

    ;(serviceContext.clients.db?.get as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return dbTemplateItem
    })
    const result = await getTemplate(serviceContext, emptyId)
    expect({
      input,
      result,
    }).toMatchSnapshot()
  })

  test('template version request should match snapshot', async () => {
    let input = null
    ;(serviceContext.clients.db?.get as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return dbTemplateItem
    })
    const result = await getTemplate(serviceContext, emptyId, 1)
    expect({
      input,
      result,
    }).toMatchSnapshot()
  })

  test('request should throw error if id is null', async () => {
    expect(async () => {
      await getTemplate(serviceContext, null as any)
    }).rejects.toThrow(MissingAttributes(['id']))
  })

  test('request should throw error if not found', async () => {
    ;(serviceContext.clients.db?.get as jest.Mock).mockImplementationOnce(() => undefined)
    expect(async () => {
      await getTemplate(serviceContext, emptyId)
    }).rejects.toThrow(TemplateNotFound(emptyId))
  })
})
