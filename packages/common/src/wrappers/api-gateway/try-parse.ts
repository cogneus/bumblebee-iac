import { InvalidRequest } from '../../exceptions'

export const tryParse = <TPayload>(body: string | undefined | null): TPayload => {
  if (!body) {
    return undefined as TPayload
  }
  try {
    return JSON.parse(body) as TPayload
  } catch (ex) {
    throw InvalidRequest(ex.message)
  }
}
