export const toBase64 = (item?: any): string | undefined => {
  if (!item) {
    return undefined
  }
  const stringifyItem = JSON.stringify(item)
  const buff = Buffer.from(stringifyItem)
  const cursor = buff.toString('base64')
  return cursor
}

export const fromBase64 = (cursor?: string): any | undefined => {
  if (!cursor) {
    return undefined
  }
  const buff = Buffer.from(cursor, 'base64')
  const str = buff.toString('utf-8')
  const item = JSON.parse(str)
  return item
}
