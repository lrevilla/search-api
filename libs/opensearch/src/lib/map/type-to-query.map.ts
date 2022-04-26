import { MatchQueryDto, NumberRangeQueryDto, TermQueryDto, DateRangeQueryDto } from '../dto'
import { QueryType } from '../enum'

// type QueryDto = typeof MatchQueryDto | typeof NumberRangeQueryDto | typeof DateRangeQueryDto | typeof TermQueryDto

export const TypeToQueryMap = {
  [QueryType.Match]: MatchQueryDto,
  [QueryType.NumberRange]: NumberRangeQueryDto,
  [QueryType.DateRange]: DateRangeQueryDto,
  [QueryType.Term]: TermQueryDto
}
