import { ProductCategory } from '@peooplev2/models'
import { BooleanQueryParameter, NumberQueryParameter } from '@peooplev2/utils'
import { Transform } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class GetSearchQueryDto {
  @IsOptional()
  @IsString()
  text?: string

  @IsOptional()
  @IsEnum(ProductCategory, { each: true })
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string') {
      return []
    }

    return value.split(',').map(category => category.trim().toLowerCase()).filter(Boolean)
  })
  category?: ProductCategory[] = []

  @IsOptional()
  @NumberQueryParameter({ max: 500 })
  size?: number = 10

  @IsOptional()
  @IsString()
  sort?: string

  @IsOptional()
  @IsString()
  paginationId?: string

  @IsOptional()
  @BooleanQueryParameter()
  isMonetizable?: boolean

  @IsOptional()
  @BooleanQueryParameter()
  isRecommendedByFriend?: boolean
}
