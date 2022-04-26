
import { ProductCategory } from '@peooplev2/models'

import { ProductDto } from './product.dto'

export class ElectronicsDto extends ProductDto {
  category = ProductCategory.Electronics
}
