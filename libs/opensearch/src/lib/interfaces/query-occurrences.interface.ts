import { SearchOccurrence } from '../types'

export interface QueryOccurrences {
  must: SearchOccurrence[]
  should: SearchOccurrence[]
  filter: SearchOccurrence[]
  must_not: SearchOccurrence[]
}
