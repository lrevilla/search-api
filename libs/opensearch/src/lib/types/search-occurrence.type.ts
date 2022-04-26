import { MatchSearchOccurrence, SingleTermSearchOccurrence, RangeSearchOccurrence, MultiTermSearchOccurrence } from '../interfaces'

export type SearchOccurrence = MatchSearchOccurrence | SingleTermSearchOccurrence | MultiTermSearchOccurrence | RangeSearchOccurrence
