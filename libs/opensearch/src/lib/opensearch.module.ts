import { DynamicModule, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import * as createAwsOpensearchConnector from 'aws-elasticsearch-connector'
import { Config } from 'aws-sdk'

import { OpenSearchIndex } from './interfaces'
import { FeedService, SearchService, IndexService } from './service'
import { RegisterAsyncOpenSearch, RegisterOpenSearchAws, RegisterOpenSearchType } from './types'

@Module({
  imports: [ConfigModule]
})
export class OpenSearchModule implements OnModuleInit {
  private static readonly indices = new Set<OpenSearchIndex>()

  constructor (
    private readonly configService: ConfigService,
    private readonly indexService: IndexService
  ) { }

  public async onModuleInit () {
    if (this.configService.get('opensearch.autoCreateIndices')) {
      await Promise.all([...OpenSearchModule.indices].map(async index => await this.indexService.createIndex(index)))
    }
  }

  public static async forRoot (params: RegisterOpenSearchType, indices: OpenSearchIndex[] = []): Promise<DynamicModule> {
    indices.forEach(index => OpenSearchModule.indices.add(index))

    return {
      module: OpenSearchModule,
      imports: [
        ConfigModule.forRoot(),
        ElasticsearchModule.register(params)
      ],
      providers: [SearchService, FeedService, IndexService],
      exports: [SearchService, FeedService, IndexService]
    }
  }

  public static async forRootAsync ({ useFactory }: RegisterAsyncOpenSearch, indices: OpenSearchIndex[] = []): Promise<DynamicModule> {
    indices.forEach(index => OpenSearchModule.indices.add(index))
    return {
      module: OpenSearchModule,
      imports: [
        ElasticsearchModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService): Promise<RegisterOpenSearchType> => {
            const dynamicConfig = useFactory
              ? await useFactory(configService)
              : {
                host: configService.get('opensearch.host'),
                pingTimeout: configService.get('opensearch.pingTimeout'),
                mode: configService.get('opensearch.mode'),
                autoCreateIndices: configService.get('opensearch.autoCreateIndices'),
                awsRegion: configService.get('aws.region'),
                awsKey: configService.get('aws.key'),
                awsSecret: configService.get('aws.secret')
              }

            return this.getConfiguration(dynamicConfig)
          },
          inject: [ConfigService]
        })
      ],
      providers: [SearchService, FeedService, IndexService],
      exports: [SearchService, FeedService, IndexService]
    }
  }

  private static getConfiguration (params: RegisterOpenSearchType) {
    let config: any = { node: params.host, pingTimeout: params.pingTimeout }

    if (params.mode === 'aws') {
      const awsParams = params as RegisterOpenSearchAws
      const awsConfig = new Config({
        region: awsParams.awsRegion,
        accessKeyId: awsParams.awsKey,
        secretAccessKey: awsParams.awsSecret
      })
      config = { ...config, ...createAwsOpensearchConnector(awsConfig) }
    }
    return config
  }
}
