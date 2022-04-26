import { ProductCategory } from '@peooplev2/models'

import { ProductDto } from './product.dto'

export class BeautyDto extends ProductDto {
  category = ProductCategory.Beauty
}
