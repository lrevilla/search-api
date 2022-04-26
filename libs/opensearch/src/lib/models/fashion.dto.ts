import { ProductCategory } from '@peooplev2/models'

import { ProductDto } from './product.dto'

export class FashionDto extends ProductDto {
  category = ProductCategory.Fashion
}
