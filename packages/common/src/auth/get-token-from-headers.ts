export const getTokenFromHeaders = (headers: any): string => {
  const bearerToken = headers.Authorization || headers.authorization
  return bearerToken?.replace(/Bearer\s+/, '')
}
