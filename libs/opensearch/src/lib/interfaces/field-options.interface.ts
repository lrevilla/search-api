import { MappingTypes } from '../enum'

export interface FieldOptions {
  name?: string
  type: MappingTypes
  searchable?: boolean
  property?: string
}
