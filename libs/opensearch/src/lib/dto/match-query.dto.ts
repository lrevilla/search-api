import { Expose } from 'class-transformer'
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString } from 'class-validator'

import { QueryOccurrence, QueryType } from '../enum'
import { MatchSearchOccurrence, Query } from '../interfaces'

export class MatchQueryDto implements Query {
  type = QueryType.Match

  @IsDefined()
  @IsString()
  field: string

  @IsDefined()
  value: string | number | boolean | Date

  @IsOptional()
  @IsBoolean()
  isFuzzy? = false

  @IsDefined()
  @IsEnum(QueryOccurrence)
  occurrence: QueryOccurrence

  @IsDefined()
  @Expose()
  public get searchOccurrence (): MatchSearchOccurrence {
    const occurrence: MatchSearchOccurrence = { match: { [this.field]: { query: this.value } } }

    if (this.isFuzzy) {
      occurrence[this.type][this.field].fuzziness = 1
    }
    return occurrence
  }
}
