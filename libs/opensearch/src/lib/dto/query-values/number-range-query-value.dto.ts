import { IsNumber, IsOptional } from 'class-validator'

import { RangeQueryValue } from '../../interfaces'

export class NumberRangeQueryValueDto implements RangeQueryValue {
  @IsOptional()
  @IsNumber()
  gt?: number

  @IsOptional()
  @IsNumber()
  lt?: number

  @IsOptional()
  @IsNumber()
  gte?: number

  @IsOptional()
  @IsNumber()
  lte?: number
}
