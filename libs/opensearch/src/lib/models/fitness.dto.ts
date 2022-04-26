
import { ProductCategory } from '@peooplev2/models'

import { ProductDto } from './product.dto'

export class FitnessDto extends ProductDto {
  category = ProductCategory.Fitness
}
