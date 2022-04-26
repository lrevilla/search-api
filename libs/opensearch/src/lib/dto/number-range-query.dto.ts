import { Expose, Type } from 'class-transformer'
import { IsDefined, IsEnum, IsString, ValidateNested } from 'class-validator'

import { QueryOccurrence, QueryType } from '../enum'
import { Query, RangeSearchOccurrence } from '../interfaces'

import { NumberRangeQueryValueDto } from './query-values'

export class NumberRangeQueryDto implements Query {
  type = QueryType.NumberRange

  @IsDefined()
  @IsString()
  field: string

  @IsDefined()
  @ValidateNested()
  @Type(() => NumberRangeQueryValueDto)
  value: NumberRangeQueryValueDto

  @IsDefined()
  @IsEnum(QueryOccurrence)
  occurrence: QueryOccurrence

  @IsDefined()
  @Expose()
  public get searchOccurrence (): RangeSearchOccurrence {
    return { range: this.value }
  }
}
