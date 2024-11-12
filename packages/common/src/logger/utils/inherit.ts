export const inheritObjects = <T = Record<string, any>, U = Record<string, any>>(
  parent: Record<string, any>,
  child: Record<string, any>
): T & U => {
  Reflect.setPrototypeOf(child, parent)

  return child as T & U
}

export const getInheritedProperties = (obj: Record<string, any>): string[] => {
  const ownInheritedKeys: string[] = []
  let currentObject = obj

  do {
    ownInheritedKeys.push(...Object.keys(currentObject))
    currentObject = Reflect.getPrototypeOf(currentObject) as Record<string, any>
  } while (currentObject && currentObject !== Object.prototype)

  return ownInheritedKeys
}
