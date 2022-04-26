import { Expose } from 'class-transformer'
import { IsDefined, IsEnum, IsString } from 'class-validator'

import { QueryOccurrence, QueryType } from '../enum'
import { MultiTermSearchOccurrence, Query, SingleTermSearchOccurrence } from '../interfaces'

export class TermQueryDto implements Query {
  type = QueryType.Term

  @IsDefined()
  @IsString()
  field: string

  @IsDefined()
  @IsString()
  value: string | string[]

  @IsDefined()
  @IsEnum(QueryOccurrence)
  occurrence: QueryOccurrence

  @IsDefined()
  @Expose()
  public get searchOccurrence (): SingleTermSearchOccurrence | MultiTermSearchOccurrence {
    if (Array.isArray(this.value)) {
      return { terms: { [this.field]: this.value } }
    }

    return { term: { [this.field]: this.value } }
  }
}
