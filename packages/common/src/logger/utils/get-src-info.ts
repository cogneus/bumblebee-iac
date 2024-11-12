import { SrcData } from '../types'

const rgx = /at (?<func>.+) \((?<file>.+):(?<line>[0-9]+):(?<position>[0-9]+)\)$/
const offset = 2

export const getSrcInfo = (level = 0): SrcData | undefined => {
  const line = new Error().stack?.split('\n')[level + offset] || ''
  const { groups } = rgx.exec(line) || {}
  if (groups) {
    const { line, position, file, func } = groups
    return {
      line: +line,
      position: +position,
      file,
      func,
    }
  }
}
