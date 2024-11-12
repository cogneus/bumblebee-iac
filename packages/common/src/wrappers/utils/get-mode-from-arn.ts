import { InvalidModeSource } from '../../exceptions'

export const getModeFromArn = (modes: string[], prefix: string, arn?: string): string => {
  if (!arn || !prefix) {
    throw InvalidModeSource(prefix, arn)
  }
  const mode = modes.find((found) => arn.includes(`${prefix}-${found}-`))
  if (!mode) {
    throw InvalidModeSource(prefix, arn)
  }
  return mode
}
