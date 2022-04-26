
import { PrimaryFieldSymbol } from '../const'
import { BaseIndex } from '../dto'

export function Primary (): PropertyDecorator {
  return (target: Object, property: string) => {
    const primaryField: { from: string, property: string } =
      Reflect.getMetadata(PrimaryFieldSymbol, target.constructor) ||
      Reflect.getMetadata(PrimaryFieldSymbol, Reflect.getPrototypeOf(target.constructor))

    if (primaryField && primaryField.from !== BaseIndex.name) {
      throw new Error(`there is already a primary field for index ${target.constructor.name.toLowerCase()}`)
    }

    return Reflect.defineMetadata(PrimaryFieldSymbol, { from: target.constructor.name, property: property.toLowerCase() }, target.constructor)
  }
}
