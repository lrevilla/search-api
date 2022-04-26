import { ProductCategory } from '@peooplev2/models'

import { PlaceDto } from './place.dto'

export class RestaurantDto extends PlaceDto {
  category = ProductCategory.Restaurants
}
