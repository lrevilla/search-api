
import { ProductCategory } from '@peooplev2/models'

import { ProductDto } from './product.dto'

export class HomeDto extends ProductDto {
  category = ProductCategory.Home
}
