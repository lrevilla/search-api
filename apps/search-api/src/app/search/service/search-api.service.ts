import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { UserDataService, LangDataService } from '@peooplev2/data'
import { ISOCountryCode } from '@peooplev2/geohash'
import { LinksAffliated } from '@peooplev2/masterdata'
import { ProductEntity, ProductTranslationEntity, ProductCategory, FollowEntity } from '@peooplev2/models'
import {
  SearchService as OpenSearchService,
  Query as OpenSearchQuery,
  QueryConfiguration,
  QueryType,
  QueryOccurrence,
  Query,
  FieldOptions,
  ThingIndex,
  IndexService,
  QueryConfigurationDto,
  MappingTypes,
  SortOrder
} from '@search-api/opensearch'
import { Image, uuid } from '@peooplev2/types'
import { isNil, uniqueArray } from '@peooplev2/utils'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { In, Repository } from 'typeorm'

import { CategorySearchableFields } from '../const'
import { GetSearchQueryDto, ProductResponseDto, SearchByCategoryParamsDto, SearchResponseDto } from '../dto'
import { ProductFields } from '../enum'

const MONETIZABLE_FIELDS: Array<keyof ProductEntity> = ['url', 'previewUrl', 'youtube', 'homepage', 'appleMusicUrl', 'androidUrl', 'iosUrl']
const MONETIZABLE_MODES = [LinksAffliated.YES, LinksAffliated.FIXED, LinksAffliated.BYPASS]
const MAX_FOLLOWEES_FETCH = 1000

@Injectable()
export class SearchApiService {
  private readonly cdnDomain = this.config.get('cdn.domain')
  private readonly defaultSorting = {
    _script: {
      type: 'number',
      script: {
        lang: 'painless',
        source: "(doc['affiliated'].value + 1) * (doc['total_recommended'].value + doc['total_saved'].value + 1) * _score"
      },
      order: SortOrder.Descending
    }
  }

  private get productSearchableFields (): { [key: string]: FieldOptions } {
    const { fields } = IndexService.getIndexMetadata<ThingIndex>(ThingIndex)
    const searchableFields: { [key: string]: FieldOptions } = {}
    Object.entries(fields)
      .filter(([, options]) => options.searchable)
      .forEach(([field, options]) => { searchableFields[field] = options })
    return searchableFields
  }

  private get textSearchableFields () {
    const { fields } = IndexService.getIndexMetadata(ThingIndex)
    const textFields = Object.entries(fields)
      .filter(([field, { type }]) => type === MappingTypes.Text || type === MappingTypes.Keyword)
      .map(([key]) => key)

    return Object.keys(this.productSearchableFields)
      .filter(field => textFields.includes(field))
  }

  private get propertyToOpenSearchFieldMap (): { [K in keyof ThingIndex]?: string } {
    const { fields } = IndexService.getIndexMetadata(ThingIndex)
    const fieldMap: { [K in keyof ThingIndex]?: string } = {}
    Object.entries(fields).forEach(([key, { property }]) => {
      fieldMap[property] = key
    })
    return fieldMap
  }

  constructor (
    private readonly config: ConfigService,
    private readonly searchService: OpenSearchService,
    private readonly langData: LangDataService,
    private readonly userData: UserDataService,

    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ProductTranslationEntity)
    private readonly productTranslationsRepository: Repository<ProductTranslationEntity>,
    @InjectRepository(FollowEntity)
    private readonly followsRepository: Repository<FollowEntity>
  ) { }

  async search (searchParams: GetSearchQueryDto, userId: uuid): Promise<SearchResponseDto> {
    const { category: categories, size, paginationId: initialPaginationId } = searchParams
    const sort = searchParams.sort || this.defaultSorting
    const configuration = plainToClass(QueryConfigurationDto, { size, sort, paginationId: initialPaginationId })
    const filters = await this.getFilters(searchParams, userId)

    const fullSearchConfig: SearchByCategoryParamsDto<ThingIndex> = { categories, configuration, filters }

    const textExists = !!searchParams.text
    if (textExists) {
      fullSearchConfig.text = searchParams.text
    }

    const [osResult, userCountry, userLanguageId] = await Promise.all([
      textExists
        ? this.searchByTextAndCategory(fullSearchConfig)
        : this.searchByCategory(fullSearchConfig),
      this.userData.getCountry(userId),
      this.userData.getLanguageId(userId)
    ])

    const mappedResult = this.applyMappings(osResult.result, searchParams, filters)

    const products = await this.thingsToProducts(mappedResult, size, userCountry, userLanguageId)
    const response: SearchResponseDto = {
      cursor: initialPaginationId || null,
      nextCursor: osResult.paginationId,
      products
    }

    return response
  }

  async rawSearch (query: OpenSearchQuery[], configuration?: QueryConfiguration) {
    return this.searchService.search(ThingIndex, query || [], configuration)
  }

  private async searchByTextAndCategory (searchByCategoryParams: SearchByCategoryParamsDto<ThingIndex>) {
    const { text, categories, filters, configuration } = plainToClass<SearchByCategoryParamsDto<ThingIndex>, any>(SearchByCategoryParamsDto, searchByCategoryParams)
    const { queries, fields } = this.getCategoryQueriesAndSearchableFields(categories)
    queries.push(...this.getFilterQueries(filters))

    if (categories.length) {
      uniqueArray(fields).forEach(field => {
        const value = field === ProductFields.Brand ? text.replace(/\s+/g, '') : text
        queries.push({
          field,
          value,
          type: QueryType.Match,
          occurrence: QueryOccurrence.Should,
          isFuzzy: true
        })
      })
    } else {
      this.textSearchableFields.forEach(field => {
        const value = field === ProductFields.Brand ? text.replace(/\s+/g, '') : text
        queries.push({
          field,
          value,
          type: QueryType.Match,
          occurrence: QueryOccurrence.Should,
          isFuzzy: true
        })
      })
    }

    return await this.searchService.search(ThingIndex, queries, configuration)
  }

  private async searchByCategory (searchByCategoryParams: SearchByCategoryParamsDto<ThingIndex>) {
    const { categories, filters, configuration } = plainToClass<SearchByCategoryParamsDto<ThingIndex>, any>(SearchByCategoryParamsDto, searchByCategoryParams)
    const { queries } = this.getCategoryQueriesAndSearchableFields(categories)
    queries.push(...this.getFilterQueries(filters))
    configuration.min_score = 0

    return await this.searchService.search(ThingIndex, queries, configuration)
  }

  private async getFilters (params: GetSearchQueryDto, userId: uuid): Promise<{ [K in keyof ThingIndex]?: ThingIndex[K] }> {
    const filters: { [K in keyof ThingIndex]?: ThingIndex[K] } = {}
    const affiliatedFilterExists = !isNil(params.isMonetizable)

    if (affiliatedFilterExists) {
      filters.affiliated = params.isMonetizable ? 1 : 0
    }

    if (params.isRecommendedByFriend) {
      const userFollowees = await this.followsRepository.find({
        select: ['userDestinationId'],
        where: { userSourceId: userId },
        order: { createAt: 'DESC' },
        take: MAX_FOLLOWEES_FETCH
      })
      filters.recommendedBy = userFollowees.map(({ userDestinationId }) => userDestinationId)
    }

    return filters
  }

  private applyMappings (elements: any[], params: GetSearchQueryDto, filters: { [K in keyof ThingIndex]?: ThingIndex[K] }): any[] {
    return elements.map(document => ({
      ...document,
      [this.propertyToOpenSearchFieldMap.recommendedBy]: params.isRecommendedByFriend
        ? _.intersection(document[this.propertyToOpenSearchFieldMap.recommendedBy], filters.recommendedBy)
        : []
    })
    )
  }

  private getFilterQueries (filters: { [K in keyof ThingIndex]?: ThingIndex[K] }): Query[] {
    return Object.entries(filters).map(([field, value]) => {
      const openSearchField = this.propertyToOpenSearchFieldMap[field]
      return {
        value,
        field: openSearchField,
        type: QueryType.Term,
        occurrence: QueryOccurrence.Must,
        isFuzzy: false
      }
    })
  }

  private getCategoryQueriesAndSearchableFields (categories: ProductCategory[]): { queries: Query[], fields: ProductFields[] } {
    const queries: Query[] = []
    const fields: ProductFields[] = []

    categories.forEach(category => {
      queries.push({
        field: ProductFields.Category,
        value: category,
        type: QueryType.Term,
        occurrence: QueryOccurrence.Must,
        isFuzzy: false
      })

      const searchableFields = CategorySearchableFields[category]
      if (searchableFields) {
        fields.push(...CategorySearchableFields[category])
      }
    })

    return { queries, fields }
  }

  private async thingsToProducts (elements: any[], size: number, userCountry: ISOCountryCode, userLanguageId: number): Promise<ProductResponseDto[]> {
    const ids = elements.slice(0, size).map(({ id }) => id)
    const products = await this.getProductData(ids, elements, userCountry, userLanguageId)

    return products.filter(Boolean)
  }

  private async getProductData (ids: uuid[], elements: any, userCountry: ISOCountryCode, userLanguageId: number): Promise<ProductResponseDto[]> {
    const [products, translations] = await Promise.all([
      this.fetchProducts(ids),
      this.fetchProductTranslations(ids, userLanguageId)
    ])

    const result = await Promise.all(
      products
        .filter(Boolean)
        .map(async product => {
          const translated = await this.findBestTranslation(userLanguageId, product, translations.get(product.id))
          const imageUrl = translated.imageUrl || product.imageUrl
          const imageType = translated.imageType || product.imageType

          const result: ProductResponseDto = {
            id: product.id,
            name: translated.name || product.name,
            categoryId: product.categoryId,
            subcategoryId: product.subcategoryId,
            address: product.address,
            author: product.author,
            brand: product.brand,
            releaseDate: product.releaseDate,
            images: [Image.recommendation(this.cdnDomain, imageUrl, imageType)].filter(Boolean),
            isMonetizable: this.isMonetizable(product),
            recommendedBy: elements.find(({ id }) => id === product.id).recommended_by
          }

          return result
        })
    )

    return result.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
  }

  private async findBestTranslation (userLangId: number, product: ProductEntity, translations: ProductTranslationEntity[]) {
    if (!translations) {
      return product
    }

    let found = translations.find(({ langId }) => langId === userLangId)

    if (found) {
      return found
    }

    const productLangId = await this.langData.getIdByLang(product.language)

    if (product.language && productLangId === userLangId) {
      return product
    }

    found = translations.find(({ langId }) => langId === this.langData.getDefaultId())

    if (found) {
      return found
    }

    return product
  }

  private async fetchProducts (ids: uuid[]): Promise<ProductEntity[]> {
    return await this.productsRepository.findByIds(ids, {
      select: [
        'id', 'name', 'language', 'categoryId', 'subcategoryId', 'releaseDate', 'address', 'brand', 'imageType', 'imageUrl', 'affiliatedMode', ...MONETIZABLE_FIELDS
      ]
    })
  }

  private async fetchProductTranslations (ids: uuid[], languageId: number): Promise<Map<uuid, ProductTranslationEntity[]>> {
    const rows = await this.productTranslationsRepository.find({
      select: ['productId', 'name', 'langId', 'imageType', 'imageUrl'],
      where: {
        productId: In(ids),
        langId: In(uniqueArray([languageId, this.langData.getDefaultId()]))
      }
    })

    const result = new Map<uuid, ProductTranslationEntity[]>()

    rows.forEach(row => {
      let list = result.get(row.productId)

      if (!list) {
        list = []
        result.set(row.productId, list)
      }

      list.push(row)
    })

    return result
  }

  private isMonetizable (product: ProductEntity): boolean {
    return MONETIZABLE_MODES.includes(product.affiliatedMode)
  }
}
