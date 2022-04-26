import { ProductCategory, ProductWithTranslationAndUserIds } from '@peooplev2/models'
import { IsDefined, IsString } from 'class-validator'

import { GenericProductDto } from './generic-product.dto'

export class ProductDto extends GenericProductDto {
  @IsDefined()
  @IsString()
  brand: string

  category = ProductCategory.Products

  protected map (product: ProductWithTranslationAndUserIds) {
    super.map(product)

    let brand = typeof product.brand === 'string' ? product.brand : null
    if (brand) {
      brand = brand.toLowerCase().replace(/[^0-9a-z]/gi, '').trim()
    }

    this.brand = brand
  }
}
