import { Inject, Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import _ from 'lodash'

import { FieldSymbol, PrimaryFieldSymbol, RoutingFieldSymbol } from '../../const'
import { FieldOptionsDto } from '../../dto'
import { IndexMetadata, OpenSearchIndex } from '../../interfaces'

@Injectable()
export class IndexService {
  private readonly logger = new Logger(IndexService.name)

  @Inject(ElasticsearchService)
  private static readonly esServiceStatic: ElasticsearchService

  constructor (private readonly elasticSearchService: ElasticsearchService) { }

  public static getIndexMetadata<T extends OpenSearchIndex> (index: OpenSearchIndex): IndexMetadata<T> {
    const configuration = Reflect.getMetadata(index.name, index) || null
    const primaryField = Reflect.getMetadata(PrimaryFieldSymbol, index)?.property || null
    const routingField = Reflect.getMetadata(RoutingFieldSymbol, index)?.property || null
    const mappings = Reflect.getOwnMetadata(FieldSymbol, index.prototype) || {}

    const mappingRequired = Object.keys(mappings).length > 0
    const properties = _.cloneDeep(mappings)
    Object.values(properties).forEach((property: FieldOptionsDto) => {
      delete property.searchable
      delete property.property
      delete property.name
    })

    if (mappingRequired) {
      configuration.body.mappings = {
        ...(routingField ? { _routing: { required: true } } : {}),
        properties
      }
    }

    return {
      name: configuration.index,
      fields: mappings,
      configuration,
      primary: primaryField,
      ...(routingField ? { routing: routingField } : {})
    }
  }

  public async createIndex (index: OpenSearchIndex): Promise<void> {
    const indexExists = await this.indexExists(index)
    const { name, configuration } = IndexService.getIndexMetadata(index)
    if (indexExists) {
      this.logger.warn(`index with name ${name} is already created, not recreating it`)
      return
    }

    this.logger.log(`creating an index with name ${name}`)
    await this.elasticSearchService.indices.create(configuration)
  }

  public async deleteIndex (index: OpenSearchIndex) {
    const { name } = IndexService.getIndexMetadata(index)
    try {
      await this.elasticSearchService.indices.delete({ index: name })
    } catch (error) {
      this.logger.warn(`not existing index ${name}`)
    }
  }

  public async ensureIndexExistence (index: OpenSearchIndex): Promise<void> {
    const { name } = IndexService.getIndexMetadata(index)
    const indexExists = await this.indexExists(index)
    if (!indexExists) {
      throw new Error(`index with name ${name} does not exist`)
    }
  }

  private async indexExists (index: OpenSearchIndex): Promise<boolean> {
    const { name } = IndexService.getIndexMetadata(index)
    const result = await this.elasticSearchService.indices.exists({ index: name })
    return result.body
  }
}
