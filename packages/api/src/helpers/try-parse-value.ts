export const tryParseValue = <T>(value: any, type: 'number' | 'boolean'): T => {
  if (!value || typeof value !== 'string') {
    return value
  }
  switch (type) {
    case 'boolean':
      return (value === 'true') as T
    case 'number':
      return parseInt(value, 10) as T
  }
}
