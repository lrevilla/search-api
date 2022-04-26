import { RequestParams } from '@elastic/elasticsearch'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { uuid } from '@peooplev2/types'
import { divideArrayByProperty, ensureArray, isNil, uniqueArray } from '@peooplev2/utils'
import { plainToClass } from 'class-transformer'

import { QueryConfigurationDto } from '../../dto'
import { QueryOccurrence, QueryType } from '../../enum'
import { OpenSearchIndex, Query, QueryConfiguration } from '../../interfaces'
import { TypeToQueryMap } from '../../map'
import { SearchOccurrence } from '../../types'
import { IndexService } from '../index/index.service'

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor (private readonly elasticSearchService: ElasticsearchService) { }

  public async findDocumentById<T> (index: OpenSearchIndex, id: uuid): Promise<T> {
    const { name } = IndexService.getIndexMetadata(index)

    const result = await this.elasticSearchService.search({ index: name, q: `_id:${id}` })
    if (result?.body.hits.hits.length > 0) {
      return result.body.hits.hits[0]._source
    }

    return null
  }

  public async search (indexes: OpenSearchIndex[] | OpenSearchIndex, queries: Query[], configuration: QueryConfiguration = {}) {
    const queryConfiguration = plainToClass(QueryConfigurationDto, configuration)
    indexes = ensureArray(indexes)

    const indexesMetadata = indexes.map(index => IndexService.getIndexMetadata(index))

    const searchQuery: RequestParams.Search = {
      index: indexesMetadata.map(({ name }) => name),
      body: {
        size: queryConfiguration.size,
        sort: queryConfiguration.sort,
        ...(!isNil(queryConfiguration.min_score) ? { min_score: queryConfiguration.min_score } : {}),
        ...(queryConfiguration.paginationId ? { search_after: queryConfiguration.paginationId } : {}),
        ...this.getQuery(queries)
      }
    }

    const result = await this.elasticSearchService.search(searchQuery)

    return {
      result: result?.body.hits.hits.map(({ _source }) => _source) || [],
      ...this.getPagination(result?.body.hits, queryConfiguration.size)
    }
  }

  private getQuery (queries: Query[]) {
    if (!queries.length) {
      return {}
    }

    const differentTypeQueries = divideArrayByProperty(queries, 'type')

    const matchQueries = this.getQueriesByType(differentTypeQueries, QueryType.Match)
    const termQueries = this.getQueriesByType(differentTypeQueries, QueryType.Term)
    const numberRangeQueries = this.getQueriesByType(differentTypeQueries, QueryType.NumberRange)
    const dateRangeQueries = this.getQueriesByType(differentTypeQueries, QueryType.DateRange)

    return {
      query: {
        bool: this.getQueryOcurrences([
          ...matchQueries,
          ...termQueries,
          ...numberRangeQueries,
          ...dateRangeQueries
        ])
      }
    }
  }

  private getPagination (resultBody: { hits: any[], total: { value: number } }, currentSize: number) {
    const sorting: any[] = resultBody.hits[resultBody.hits.length - 1]?.sort
    if (!sorting || resultBody.hits.length < currentSize) {
      return {}
    }

    return { paginationId: Buffer.from(sorting.toString()).toString('base64') }
  }

  private getQueriesByType (queries: { value: QueryType, list: Query[] }[], queryType: QueryType): Query[] {
    let matchingTypeQueries = queries.find(({ value }) => value === queryType)?.list || []
    if (queryType === QueryType.Term) {
      matchingTypeQueries = this.aggregateTermQueryFields(matchingTypeQueries)
    }

    return plainToClass(TypeToQueryMap[queryType] as any, matchingTypeQueries || [])
  }

  private getQueryOcurrences (query: Query[]): { [key in QueryOccurrence]: SearchOccurrence[] } {
    const queriesByOccurrence = divideArrayByProperty(query, 'occurrence')
    return {
      [QueryOccurrence.Must]: this.getSearchForOccurrence(queriesByOccurrence, QueryOccurrence.Must),
      [QueryOccurrence.Should]: this.getSearchForOccurrence(queriesByOccurrence, QueryOccurrence.Should),
      [QueryOccurrence.Filter]: this.getSearchForOccurrence(queriesByOccurrence, QueryOccurrence.Filter),
      [QueryOccurrence.MustNot]: this.getSearchForOccurrence(queriesByOccurrence, QueryOccurrence.MustNot)
    }
  }

  private getSearchForOccurrence (queries: { value: QueryOccurrence, list: Query[] }[], occurrence: QueryOccurrence) {
    return queries
      .find(({ value }) => value === occurrence)?.list
      .map(({ searchOccurrence }) => searchOccurrence) || []
  }

  private aggregateTermQueryFields (queries: Query[]): Query[] {
    if (!queries.every(({ type }) => type === QueryType.Term)) {
      this.logger.warn('only term queries can be aggregated')
      return queries
    }

    return [...new Set(queries.map(({ field }) => field))]
      .map((uniqueField: string) => {
        const uniqueFieldQueries = queries.filter(({ field }) => field === uniqueField)
        return divideArrayByProperty(uniqueFieldQueries, 'occurrence')
          .map<Query>(({ list }) => ({ ...list[0], value: uniqueArray(list.map(({ value }) => value as any).flat()) }))
      })
      .flat()
  }
}
