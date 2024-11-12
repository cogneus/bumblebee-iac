import { serviceContext } from '../../__mocks__/service-context.mock'
import { dbTemplateItem, templateItem } from '../../__mocks__/template.mock'
import { updateTemplate } from '../update-template'

describe('Update template tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  test('db request should match snapshot', async () => {
    let input = null
    ;(serviceContext.clients.db?.get as jest.Mock).mockImplementationOnce(() => dbTemplateItem)
    ;(serviceContext.clients.db?.transactWrite as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return null
    })
    const result = await updateTemplate(serviceContext, dbTemplateItem.id, templateItem)
    expect({
      input,
      result,
    }).toMatchSnapshot()
  })
})
