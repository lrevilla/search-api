import { Field, Index, Routing } from '../decorators'
import { BaseIndex } from '../dto/base.index'
import { MappingTypes } from '../enum'
import { OpenSearchIndex } from '../interfaces/opensearch-index.interface'

@Index('thing_v2', { NumberOfReplicas: 3, NumberOfShards: 16 })
export class ThingIndex extends BaseIndex implements OpenSearchIndex {
  @Field({ type: MappingTypes.Text, searchable: true })
  names: string[]

  @Field({ name: 'total_recommended', type: MappingTypes.Integer })
  totalRecommended: number

  @Field({ name: 'total_saved', type: MappingTypes.Integer })
  totalSaved: number

  @Field({ type: MappingTypes.Keyword, searchable: true })
  languages: string[]

  @Field({ type: MappingTypes.Integer, searchable: true })
  affiliated: number

  @Field({ name: 'monetizable_at', type: MappingTypes.Keyword, searchable: true })
  monetizableAt: string[]

  @Field({ name: 'recommended_by', type: MappingTypes.Keyword, searchable: true })
  recommendedBy: string[]

  @Routing()
  @Field({ type: MappingTypes.Keyword })
  category: string

  @Field({ type: MappingTypes.Keyword, searchable: true })
  brand?: string

  @Field({ type: MappingTypes.Text, searchable: true })
  album?: string

  @Field({ type: MappingTypes.Text, searchable: true })
  authors?: string[]

  @Field({ type: MappingTypes.Text, searchable: true })
  artists?: string[]

  @Field({ name: 'full_address', type: MappingTypes.Text, searchable: true })
  fullAddress?: string
}
