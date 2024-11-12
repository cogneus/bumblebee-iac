import { Clients } from './types'

export const destroyClients = (clients: Clients) => {
  if (clients) {
    Object.values(clients).forEach((client) => client?.destroy())
  }
}
