import { MissingAttributes } from '../../../exceptions'
import { serviceContext } from '../../__mocks__/service-context.mock'
import { dbTemplateItem } from '../../__mocks__/template.mock'
import { removeTemplate } from '../remove-template'
import { NIL as emptyId } from 'uuid'

describe('Remove template tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  const { PK, SK } = dbTemplateItem

  test('db request should match snapshot', async () => {
    let input, queryInput
    ;(serviceContext.clients.db?.get as jest.Mock).mockImplementationOnce(() => dbTemplateItem)
    ;(serviceContext.clients.db?.transactWrite as jest.Mock).mockImplementationOnce((params) => {
      input = params
      return null
    })
    ;(serviceContext.clients.db?.query as jest.Mock).mockImplementation((params, _, cursor) => {
      queryInput = params
      return {
        items: [
          { PK, SK },
          { PK, SK },
          { PK, SK },
        ],
        cursor: cursor ? undefined : 'test',
      }
    })
    const result = await removeTemplate(serviceContext, emptyId)
    expect({
      input,
      queryInput,
      result,
    }).toMatchSnapshot()
  })

  test('request should throw error', async () => {
    expect(async () => {
      await removeTemplate(serviceContext, null as any)
    }).rejects.toThrow(MissingAttributes(['id']))
  })
})
