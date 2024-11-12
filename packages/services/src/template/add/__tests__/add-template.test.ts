import { serviceContext } from '../../__mocks__/service-context.mock'
import { templateItem } from '../../__mocks__/template.mock'
import { addTemplate } from '../add-template'
import { generateId } from '../../helpers/generate-id'
import { NIL as emptyId } from 'uuid'

jest.mock('../../helpers/generate-id')

describe('Add template tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  test('db request should match snapshot', async () => {
    let input
    ;(serviceContext.clients.db?.transactWrite as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return null
    })
    ;(generateId as jest.Mock).mockReturnValue(emptyId)
    const result = await addTemplate(serviceContext, templateItem)
    expect({
      input,
      result,
    }).toMatchSnapshot()
  })
})
