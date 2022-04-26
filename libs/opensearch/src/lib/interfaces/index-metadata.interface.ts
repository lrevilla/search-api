import { FieldOptions } from './field-options.interface'
import { IndexConfiguration } from './index-configuration.interface'

export interface IndexMetadata<T> {
  name: string
  configuration: IndexConfiguration
  fields: { [key: string]: FieldOptions }
  primary: keyof T
  routing?: keyof T
}
