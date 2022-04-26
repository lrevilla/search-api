import { ProductCategory } from '@peooplev2/models'

import { GenericProductDto } from './generic-product.dto'

export class VideogameDto extends GenericProductDto {
  category = ProductCategory.Videogames
 }
