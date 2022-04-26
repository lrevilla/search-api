
import { ProductFields, ProductCategory } from '../enum'

export const CategorySearchableFields = {
  [ProductCategory.Generic]: [ProductFields.Names]
}

CategorySearchableFields[ProductCategory.Apps] = [
  ...CategorySearchableFields[ProductCategory.Generic]
]
CategorySearchableFields[ProductCategory.Books] = [
  ...CategorySearchableFields[ProductCategory.Generic],
  ProductFields.Authors
]
CategorySearchableFields[ProductCategory.Movies] = [
  ...CategorySearchableFields[ProductCategory.Generic]
]
CategorySearchableFields[ProductCategory.Music] = [
  ...CategorySearchableFields[ProductCategory.Generic],
  ProductFields.Artists,
  ProductFields.Album
]
CategorySearchableFields[ProductCategory.Places] = [
  ...CategorySearchableFields[ProductCategory.Generic],
  ProductFields.FullAddress
]
CategorySearchableFields[ProductCategory.Products] = [
  ...CategorySearchableFields[ProductCategory.Generic],
  ProductFields.Brand
]
CategorySearchableFields[ProductCategory.Series] = [
  ...CategorySearchableFields[ProductCategory.Generic]
]
CategorySearchableFields[ProductCategory.Videogames] = [
  ...CategorySearchableFields[ProductCategory.Generic]
]

CategorySearchableFields[ProductCategory.Restaurants] = [
  ...CategorySearchableFields[ProductCategory.Places]
]

CategorySearchableFields[ProductCategory.Beauty] = [
  ...CategorySearchableFields[ProductCategory.Products]
]
CategorySearchableFields[ProductCategory.Fashion] = [
  ...CategorySearchableFields[ProductCategory.Products]
]
