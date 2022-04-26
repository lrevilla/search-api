import { IsDate, IsOptional } from 'class-validator'

import { RangeQueryValue } from '../../interfaces'

export class DateRangeQueryValueDto implements RangeQueryValue {
  @IsOptional()
  @IsDate()
  gt?: Date

  @IsOptional()
  @IsDate()
  lt?: Date

  @IsOptional()
  @IsDate()
  gte?: Date

  @IsOptional()
  @IsDate()
  lte?: Date
}
