import { ProductCategory } from '@peooplev2/models'

import { GenericProductDto } from './generic-product.dto'

export class TvShowDto extends GenericProductDto {
  category = ProductCategory.Series
}
