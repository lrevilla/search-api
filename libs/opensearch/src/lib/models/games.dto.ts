
import { ProductCategory } from '@peooplev2/models'

import { ProductDto } from './product.dto'

export class GamesDto extends ProductDto {
  category = ProductCategory.Games
}
