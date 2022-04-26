import { ApiProperty } from '@nestjs/swagger'

import { ProductResponseDto } from './product-response.dto'

export class SearchResponseDto {
  @ApiProperty()
  cursor: string

  @ApiProperty()
  nextCursor: string

  @ApiProperty({
    type: ProductResponseDto,
    isArray: true
  })
  products: ProductResponseDto[]
}
