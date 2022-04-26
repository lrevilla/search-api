
import { RoutingFieldSymbol } from '../const'
import { BaseIndex } from '../dto'

export function Routing (): PropertyDecorator {
  return (target: Object, property: string) => {
    const routingField: { from: string, property: string } =
      Reflect.getMetadata(RoutingFieldSymbol, target.constructor) ||
      Reflect.getMetadata(RoutingFieldSymbol, Reflect.getPrototypeOf(target.constructor))

    if (routingField && routingField.from !== BaseIndex.name) {
      throw new Error(`there is already a routing field for index ${target.constructor.name.toLowerCase()}`)
    }

    return Reflect.defineMetadata(RoutingFieldSymbol, { from: target.constructor.name, property: property.toLowerCase() }, target.constructor)
  }
}
