import { destroyClients } from '../destroy-clients'
import { clients } from '../__mocks__/clients.const'

describe('Destroy clients tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call destroy', async () => {
    destroyClients(clients)
    expect(clients.db?.destroy).toBeCalled()
    expect(clients.ssm?.destroy).toBeCalled()
    expect(clients.secrets?.destroy).toBeCalled()
  })
})
