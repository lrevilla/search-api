import { Expose, Type } from 'class-transformer'
import { IsDefined, IsEnum, IsString, ValidateNested } from 'class-validator'

import { QueryOccurrence, QueryType } from '../enum'
import { Query, RangeSearchOccurrence } from '../interfaces'

import { DateRangeQueryValueDto } from './query-values'

export class DateRangeQueryDto implements Query {
  type = QueryType.DateRange

  @IsDefined()
  @IsString()
  field: string

  @IsDefined()
  @ValidateNested()
  @Type(() => DateRangeQueryValueDto)
  value: DateRangeQueryValueDto

  @IsDefined()
  @IsEnum(QueryOccurrence)
  occurrence: QueryOccurrence

  @IsDefined()
  @Expose()
  public get searchOccurrence (): RangeSearchOccurrence {
    return { range: { [this.field]: this.value } }
  }
}
