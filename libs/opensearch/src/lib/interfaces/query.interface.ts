import { QueryOccurrence, QueryType } from '../enum'
import { SearchOccurrence } from '../types'

import { RangeQueryValue } from './range-query-value.interface'

export interface Query {
  field: string
  value: string | string[] | number | boolean | Date | RangeQueryValue
  isFuzzy?: boolean
  occurrence: QueryOccurrence
  searchOccurrence?: SearchOccurrence
  type: QueryType
}
