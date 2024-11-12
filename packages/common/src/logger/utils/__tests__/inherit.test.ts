import { inheritObjects, getInheritedProperties } from '../inherit'

describe('Object inharitance utils', () => {
  describe('inheritObjects', () => {
    test('should set parent object as a proto for a child', () => {
      const parent = { parentProp: 'parentValue' }
      const child = { childProp: 'childValue' }

      const result = inheritObjects<typeof parent, typeof child>(parent, child)

      expect(result.childProp).toBe(child.childProp)
      expect(result.parentProp).toBe(parent.parentProp)
    })

    test('should remain getters working', () => {
      const parent = {
        get parentProp() {
          return 'parentValue'
        },
      }
      const child = { childProp: 'childValue' }

      const result = inheritObjects<typeof parent, typeof child>(parent, child)

      expect(result.parentProp).toBe(parent.parentProp)
    })
  })

  describe('getInheritedProperties', () => {
    const test1: Record<string, any> = { prop1: 'prop1' }
    const test2: Record<string, any> = { prop2: 'prop2' }
    const test3: Record<string, any> = { prop3: 'prop3' }
    const test4: Record<string, any> = { prop4: 'prop4' }

    const chain = [test2, test3, test4].reduce(
      (accum, value) => inheritObjects(accum, value),
      test1 as Record<string, any>
    )

    test('should include properties from all prototype chain', () => {
      const result = getInheritedProperties(chain)

      expect(result.sort()).toEqual(['prop1', 'prop2', 'prop3', 'prop4'])
    })

    test('should not failt on Object.create(null) in the chain', () => {
      const parent = Object.create(null)
      const child = { prop1: 'prop1' }
      const protoChain = inheritObjects(parent, child)

      expect(getInheritedProperties(protoChain).sort()).toEqual(['prop1'])
    })
  })
})
