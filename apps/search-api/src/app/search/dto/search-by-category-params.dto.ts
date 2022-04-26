import { ProductCategory } from '@peooplev2/models'
import { QueryConfigurationDto } from '@search-api/opensearch'
import { Type } from 'class-transformer'
import { IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'

export class SearchByCategoryParamsDto<T> {
  @IsOptional()
  @IsString()
  text?: string

  @IsOptional()
  @IsEnum(ProductCategory, { each: true })
  categories?: ProductCategory[] = []

  @IsOptional()
  @IsObject()
  filters?: { [K in keyof T]?: T[K] } = {}

  @IsOptional()
  @ValidateNested()
  @Type(() => QueryConfigurationDto)
  configuration?: QueryConfigurationDto = {}
}
