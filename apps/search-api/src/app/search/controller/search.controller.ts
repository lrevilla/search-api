
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { Query as OpenSearchQuery, QueryConfiguration } from '@search-api/opensearch'
import { GetUserId } from '@peooplev2/security'
import { uuid } from '@peooplev2/types'

import { GetSearchQueryDto } from '../dto/get-search-query.dto'
import { SearchResponseDto } from '../dto/search-response.dto'
import { SearchApiService } from '../service/search-api.service'

@Controller('v1.0/search')
export class SearchController {
  constructor (private readonly service: SearchApiService) { }

  @Get()
  public async search (
    @Query() query: GetSearchQueryDto,
    @GetUserId() userId: uuid
  ): Promise<SearchResponseDto> {
    return this.service.search(query, userId)
  }

  @Post()
  public async rawSearch (
    @Body('query') query: OpenSearchQuery[],
    @Body('configuration') configuration?: QueryConfiguration
  ) {
    return this.service.rawSearch(query, configuration)
  }
}
