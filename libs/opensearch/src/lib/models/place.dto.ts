import { ProductCategory, ProductWithTranslationAndUserIds } from '@peooplev2/models'
import { IsDefined, IsString } from 'class-validator'

import { GenericProductDto } from './generic-product.dto'

export class PlaceDto extends GenericProductDto {
  @IsDefined()
  @IsString()
  fullAddress: string

  category = ProductCategory.Places

  protected map (product: ProductWithTranslationAndUserIds) {
    super.map(product)
    this.fullAddress = product.address ?? null
  }
}
