export const errorSource = <TError = any>(ex) => {
  if (ex.errorType === 'Runtime.UnhandledPromiseRejection') {
    return ex.reason as TError
  }
  return ex as TError
}
