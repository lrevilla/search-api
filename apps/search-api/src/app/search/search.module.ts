import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CockroachDbModule } from '@peooplev2/cockroachdb'
import { DataModule } from '@peooplev2/data'
import { FollowEntity, ProductEntity, ProductTranslationEntity } from '@peooplev2/models'
import { OpenSearchModule } from '@search-api/opensearch'

import { SearchController } from './controller/search.controller'
import { SearchApiService } from './service/search-api.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    OpenSearchModule.forRootAsync({}),
    CockroachDbModule.forFeature([
      ProductEntity,
      ProductTranslationEntity,
      FollowEntity
    ]),
    DataModule.forRoot()
  ],
  controllers: [SearchController],
  providers: [SearchApiService]
})
export class SearchModule { }
