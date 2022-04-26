import { ProductCategory } from '@peooplev2/models'

import { GenericProductDto } from './generic-product.dto'

export class AppDto extends GenericProductDto {
  category = ProductCategory.Apps
}
