import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CockroachDbModule } from '@peooplev2/cockroachdb'
import configuration from '@peooplev2/configuration'
import { JwtMiddleware, JwtModule } from '@peooplev2/jwt'

import { HealthModule } from './health/health.module'
import { SearchModule } from './search/search.module'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './apps/search-api/.env', load: configuration }),
    CockroachDbModule.forRootAsync({}),
    HealthModule,
    SearchModule,
    JwtModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*')
  }
}
