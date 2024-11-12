import { Transformer, TransformerInput } from '../../types'
import { defaultLevels } from '../../consts'
import { mergeTransformer } from '../merge-transformer'

describe('Transform log utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should write the log in a transformed format', () => {
    const trMetadata = { some: 'data' }
    const data: TransformerInput = {
      eventCode: 'test-code',
      level: 'debug',
      message: 'Log message',
      eventData: { ...trMetadata },
      levelNumber: defaultLevels.debug,
      scope: {},
    }
    const transformers: Transformer[] = [
      ({ eventCode, level, message, eventData }) => ({
        level,
        eventCode,
        message,
        trMetadata: eventData,
        transform: [1],
        override: 1,
      }),
      (input, entry) => ({
        ...entry,
        transform: [...(entry?.transform as []), 2],
        override: 2,
      }),
    ]
    const transformer = mergeTransformer({ transformers })

    const output = transformer(data)

    expect(output).toEqual({
      level: data.level,
      eventCode: data.eventCode,
      message: data.message,
      trMetadata,
      transform: [1, 2],
      override: 2,
    })
  })
})
