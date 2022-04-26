import { ProductCategory, ProductWithTranslationAndUserIds } from '@peooplev2/models'
import { uuid } from '@peooplev2/types'
import { IsDefined, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator'

import { ThingIndex } from '../indexes'

export class GenericProductDto implements ThingIndex {
  @IsDefined()
  @IsUUID()
  id: uuid

  @IsDefined()
  @IsString({ each: true })
  names: string[]

  @IsDefined()
  @IsString({ each: true })
  languages: string[]

  @IsDefined()
  @IsNumber()
  totalRecommended: number

  @IsDefined()
  @IsNumber()
  totalSaved: number

  @IsDefined()
  @IsNumber()
  affiliated: number

  @IsDefined()
  @IsString({ each: true })
  monetizableAt: string[]

  @IsDefined()
  @IsUUID(4, { each: true })
  recommendedBy: uuid[]

  @IsDefined()
  @IsEnum(ProductCategory)
  category: ProductCategory = ProductCategory.Generic

  constructor (product: ProductWithTranslationAndUserIds) {
    this.map(product)
  }

  protected map (product: ProductWithTranslationAndUserIds) {
    this.id = product.id
    this.names = [...new Set([product.name, ...product.names])]
      .filter(Boolean)
      .map(name => name.trim())

    this.totalRecommended = product.recommendations ?? 0
    this.totalSaved = product.saved ?? 0
    this.affiliated = product.affiliated ? 1 : 0
    this.monetizableAt = []

    if (Array.isArray(product.recommendedBy)) {
      this.recommendedBy = product.recommendedBy
    }

    this.languages = [...new Set([product.language, ...product.languages])]
      .filter(Boolean)
  }
}
