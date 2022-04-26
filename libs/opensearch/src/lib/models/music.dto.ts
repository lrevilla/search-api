import { ProductCategory, ProductWithTranslationAndUserIds } from '@peooplev2/models'
import { IsDefined, IsString } from 'class-validator'

import { GenericProductDto } from './generic-product.dto'

export class MusicDto extends GenericProductDto {
  @IsDefined()
  @IsString()
  album: string

  @IsDefined()
  @IsString({ each: true })
  artists: string[]

  category = ProductCategory.Music

  protected map (product: ProductWithTranslationAndUserIds) {
    super.map(product)
    this.album = product.albumName

    this.artists = [...new Set(`${product.artists ?? ''};${product.albumArtists ?? ''}`.split(';'))]
      .reduce((artists: string[], currentArtist: string) => [...artists, ...currentArtist.split(',')], [])
      .filter(Boolean)
      .map((artist: string) => artist.trim())
  }
}
