import { Params } from './config-params.interface'

const getValue = (path: string, config: Record<string, any>) =>
  path.split('.').reduce((acc, part) => acc[part], config)

const regex = /\${([^${}]*?)}/g
const processConfigElement = (value: any, config: Record<string, any>) => {
  let val = value
  if (typeof val !== 'string' || !val.includes('${')) {
    return val
  }
  let matches: RegExpMatchArray | null = null
  do {
    matches = val.match(regex)
    if (matches) {
      val = matches?.reduce((accVal, match) => {
        const replacement = getValue(match.substring(2, match.length - 1), config)
        return accVal.replace(match, replacement)
      }, val)
    }
  } while (matches)
  return val
}

const processConfigObject = (obj: Record<string, any>, config?: Record<string, any>) => {
  const object = obj
  const configValue = config || object
  Object.entries(object).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object') {
        processConfigObject(value, configValue)
      } else {
        object[key] = processConfigElement(value, configValue)
      }
    }
  })
}

export const processConfig = (config: Record<string, any>, params: Params) => {
  let configValue = config
  const { component, region, stage } = params
  const { defaultComponent, defaultRegion, defaultStage, components } = configValue
  configValue = {
    ...configValue,
    ...params,
    componentName: component ? components[component] : defaultComponent,
    region: region || defaultRegion,
    stage: stage || defaultStage,
  }

  processConfigObject(configValue)
  return configValue
}
