import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { uuid } from '@peooplev2/types'
import { chunkForEachLimit, divideArrayByProperty } from '@peooplev2/utils'

import { classToOpenSearchDoc } from '../../functions'
import { OpenSearchIndex } from '../../interfaces'
import { IndexService } from '../index/index.service'
import { SearchService } from '../search/search.service'

const RETRY_ON_CONFLICT = 25

@Injectable()
export class FeedService {
  constructor (
    private readonly elasticSearchService: ElasticsearchService,
    private readonly searchService: SearchService,
    private readonly indexService: IndexService
  ) { }

  public async bulkInsert<T extends OpenSearchIndex> (index: OpenSearchIndex, items: T[]): Promise<void> {
    const filteredItems = items.filter(Boolean)
    if (!filteredItems.length) {
      return
    }

    await this.indexService.ensureIndexExistence(index)
    const { name, primary, routing } = IndexService.getIndexMetadata<T>(index)

    const upsertQuery = (all: any[], item: T) => {
      const openSearchDoc = classToOpenSearchDoc(index, item)
      return [
        ...all,
        { update: { _id: openSearchDoc[(primary as string)], retry_on_conflict: RETRY_ON_CONFLICT } },
        { doc: openSearchDoc, doc_as_upsert: true }
      ]
    }

    if (!routing) {
      const body = filteredItems.reduce(upsertQuery, [])
      await this.elasticSearchService.bulk({ index: name, body, refresh: true })

      return
    }

    const bulkBodiesRouting = divideArrayByProperty(filteredItems, routing)
      .map(({ list, value }) => {
        const body = list.reduce(upsertQuery, [])
        return { index: name, routing: value, body, refresh: true }
      })

    await chunkForEachLimit(bulkBodiesRouting, 1, 25, async ([bulkBody]) => await this.elasticSearchService.bulk(bulkBody))
  }

  public async insertDocument<T extends OpenSearchIndex> (index: OpenSearchIndex, id: uuid, document: T): Promise<void> {
    await this.indexService.ensureIndexExistence(index)
    const { name, routing } = IndexService.getIndexMetadata<T>(index)
    const routingValue: any = document[routing] || null

    await this.elasticSearchService.index({
      index: name,
      id,
      body: classToOpenSearchDoc(index, document),
      ...(routingValue ? { routing: routingValue } : {})
    })
  }

  public async updateById<T> (index: OpenSearchIndex, id: uuid, update: Partial<T>): Promise<void> {
    await this.indexService.ensureIndexExistence(index)

    const { name, routing } = IndexService.getIndexMetadata(index)

    const currentDocument = classToOpenSearchDoc(index, document)
    const routingValue = currentDocument[routing] || null

    await this.elasticSearchService.update({
      index: name,
      id,
      body: { doc: classToOpenSearchDoc(index, update) },
      retry_on_conflict: RETRY_ON_CONFLICT,
      ...(routingValue ? { routing: routingValue } : {})
    })
  }

  public async addElementToListProperty<T> (index: OpenSearchIndex, id: uuid, property: keyof T, elements: any | any[]): Promise<void> {
    if (!Array.isArray(elements)) {
      elements = [elements]
    }

    await this.addOrRemoveElementToListProperty<T>(index, id, property, elements, 'add')
  }

  public async removeElementToListProperty<T> (index: OpenSearchIndex, id: uuid, property: keyof T, elements: any | any[]): Promise<void> {
    if (!Array.isArray(elements)) {
      elements = [elements]
    }

    await this.addOrRemoveElementToListProperty<T>(index, id, property, elements, 'remove')
  }

  public async deleteDocumentById<T> (index: OpenSearchIndex, id: uuid): Promise<void> {
    await this.indexService.ensureIndexExistence(index)

    const { name, routing } = IndexService.getIndexMetadata(index)
    const document = await this.ensureDocumentExistence<T>(index, id)

    const currentDocument = classToOpenSearchDoc(index, document)
    const routingValue = currentDocument[routing]

    await this.elasticSearchService.delete({
      index: name,
      id,
      ...(routingValue ? { routing: routingValue } : {})
    })
  }

  public async bulkDelete<T> (index: OpenSearchIndex, items: T[]): Promise<void> {
    const filteredItems = items.filter(Boolean)
    if (!filteredItems.length) {
      return
    }

    await this.indexService.ensureIndexExistence(index)
    const { name, primary, routing } = IndexService.getIndexMetadata(index)

    const deleteMapping = (item: T) => ({ delete: { _id: classToOpenSearchDoc(index, item)[(primary as string)] } })

    if (!routing) {
      const body = filteredItems.map(deleteMapping)
      await this.elasticSearchService.bulk({ index: name, body, refresh: true })

      return
    }

    const bulkBodiesRouting = divideArrayByProperty(filteredItems, routing as any)
      .map(({ list, value }) => {
        const body = list.map(deleteMapping)
        return { index: name, routing: value, body, refresh: true }
      })

    await chunkForEachLimit(bulkBodiesRouting, 1, 25, async ([bulkBody]) => this.elasticSearchService.bulk(bulkBody))
  }

  private async addOrRemoveElementToListProperty<T> (index: OpenSearchIndex, id: uuid, property: keyof T, elements: any[], action: 'add' | 'remove' = 'add'): Promise<void> {
    const document = await this.ensureDocumentExistence<T>(index, id)
    const { name, routing, fields } = IndexService.getIndexMetadata(index)

    const [currentField] = Object.entries(fields).find(([, fieldOptions]) => fieldOptions.property === property) || []
    const propertyName = currentField ?? property as string
    const source = this.getPainlessScript(action, propertyName)

    const currentDocument = classToOpenSearchDoc(index, document)
    const routingValue = currentDocument[routing]

    await this.elasticSearchService.update({
      index: name,
      id,
      body: {
        script: {
          source,
          lang: 'painless',
          params: { elements }
        }
      },
      retry_on_conflict: RETRY_ON_CONFLICT,
      ...(routingValue ? { routing: routingValue } : {})
    })
  }

  private async ensureDocumentExistence<T> (index: OpenSearchIndex, id: uuid): Promise<T> {
    const document: T = await this.searchService.findDocumentById(index, id)

    if (!document) {
      throw new Error(`document with _id ${id} not found on opensearch`)
    }

    return document
  }

  private getPainlessScript (action: 'add' | 'remove' = 'add', property: string): string {
    if (action === 'add') {
      return `
      if (ctx._source.${property} == null) {
        ctx._source.${property} = params.elements
      } else {
        for (element in params.elements) {
          if (!ctx._source.${property}.contains(element) ){
            ctx._source.${property}.add(element)
          }
        }
      }
      `
    } else {
      return `
      if (ctx._source.${property} != null) {
        ctx._source.${property}.removeAll(params.elements)
      }
      `
    }
  }
}
