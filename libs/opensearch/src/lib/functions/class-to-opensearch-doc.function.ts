import { copyWithoutUndefined } from '@peooplev2/utils'

import { FieldSymbol } from '../const'
import { FieldOptionsDto } from '../dto'
import { OpenSearchIndex } from '../interfaces'

export function classToOpenSearchDoc (index: OpenSearchIndex, cls: any): { [key: string]: any } {
  const mappings = Reflect.getOwnMetadata(FieldSymbol, index.prototype) || {}
  const classAsJSON = JSON.parse(JSON.stringify(cls))
  if (!mappings) {
    return classAsJSON
  }

  const documentKeyValues = Object.entries(mappings)
  if (!documentKeyValues.length) {
    return null
  }

  const openSearchDoc = {}

  documentKeyValues
    .forEach(([key, value]: [string, FieldOptionsDto]) => {
      openSearchDoc[key] = classAsJSON[value.property]
    })

  return copyWithoutUndefined(openSearchDoc)
}
