import { Transform } from 'class-transformer'
import { IsArray, IsNumber, IsObject, IsOptional } from 'class-validator'

import { QueryConfiguration } from '../interfaces'

export class QueryConfigurationDto implements QueryConfiguration {
  @IsOptional()
  @IsNumber()
  min_score?: number = 1.00001

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? +value : 10)
  size?: number

  @IsOptional()
  @IsObject({ each: true })
  sort?: any = null

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value
    }

    return Buffer.from(value, 'base64').toString().split(',')
  })
  paginationId?: string
}
