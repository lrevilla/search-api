import { ApiProperty } from '@nestjs/swagger'
import { Image, uuid } from '@peooplev2/types'

export class ProductResponseDto {
  @ApiProperty({
    type: String,
    format: 'uuid'
  })
  id: uuid

  @ApiProperty()
  name: string

  @ApiProperty()
  categoryId: number

  @ApiProperty()
  subcategoryId: number

  @ApiProperty()
  address: string

  @ApiProperty()
  author: string

  @ApiProperty()
  brand: string

  @ApiProperty()
  releaseDate: Date

  @ApiProperty({
    type: Image,
    isArray: true
  })
  images: Image[]

  @ApiProperty()
  isMonetizable: boolean

  @ApiProperty({
    type: String,
    format: 'uuid'
  })
  recommendedBy: uuid[]
}
