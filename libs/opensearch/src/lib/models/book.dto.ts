import { ProductCategory, ProductWithTranslationAndUserIds } from '@peooplev2/models'
import { IsDefined, IsString } from 'class-validator'

import { GenericProductDto } from './generic-product.dto'

export class BookDto extends GenericProductDto {
  @IsDefined()
  @IsString({ each: true })
  authors: string[] = []

  category = ProductCategory.Books

  protected map (product: ProductWithTranslationAndUserIds) {
    super.map(product)

    this.authors = (product.author ?? '').split(';')
      .reduce((authors: string[], currentAuthor: string) => [...authors, ...currentAuthor.split(',')], [])
      .filter(Boolean)
      .map((author: string) => author.trim())
  }
}
