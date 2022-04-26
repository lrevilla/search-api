import { ProductCategory } from '@peooplev2/models'

import { GenericProductDto } from './generic-product.dto'

export class FilmDto extends GenericProductDto {
  category = ProductCategory.Movies
}
