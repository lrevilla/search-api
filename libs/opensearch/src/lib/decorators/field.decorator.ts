import { classToPlain, plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

import { FieldSymbol } from '../const'
import { FieldOptionsDto } from '../dto'
import { FieldOptions } from '../interfaces'

export function Field (options: FieldOptions): PropertyDecorator
export function Field (options: FieldOptions = null): PropertyDecorator {
  return async (target: Object, property: string) => {
    const name = options?.name ?? property.toLowerCase()

    if (!options) {
      throw new Error(`invalid options for field ${name}`)
    }

    options = plainToClass(FieldOptionsDto, { ...options, property })
    const errors = await validate(options)

    if (errors.length) {
      throw new Error(`some options failed for field ${property}: ${errors.map(error => error.property)}`)
    }

    const parentFields = Reflect.getOwnMetadata(FieldSymbol, Object.getPrototypeOf(target)) || {}
    const fields = { ...parentFields, ...(Reflect.getOwnMetadata(FieldSymbol, target) || {}) }
    fields[name.toLowerCase()] = classToPlain(options)

    return Reflect.defineMetadata(FieldSymbol, fields, target)
  }
}
