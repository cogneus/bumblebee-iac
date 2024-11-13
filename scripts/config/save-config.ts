import { writeFileSync } from 'fs'

export const saveConfigFile = (filePath: string, config: Record<string, any>) => {
  writeFileSync(`${filePath}`, JSON.stringify(config, null, 2), 'utf8')
}
