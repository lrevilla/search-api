import { uuid } from '@peooplev2/types'
import { uuidv4 } from '@peooplev2/utils'

import { Field, Index } from '../decorators'
import { BaseIndex } from '../dto/base.index'
import { MappingTypes } from '../enum'
import { OpenSearchIndex } from '../interfaces/opensearch-index.interface'

@Index('collections_v2', { NumberOfShards: 5 })
export class CollectionsV2Index extends BaseIndex implements OpenSearchIndex {
  @Field({ type: MappingTypes.Boolean })
  cmsOnly: boolean

  @Field({ type: MappingTypes.Long })
  counter: number

  @Field({ type: MappingTypes.Keyword })
  fingerprint?: uuid = uuidv4()

  @Field({ type: MappingTypes.Keyword })
  image_1: string

  @Field({ type: MappingTypes.Keyword })
  image_2: string

  @Field({ type: MappingTypes.Keyword })
  image_3: string

  @Field({ type: MappingTypes.Long })
  likes: number

  @Field({ type: MappingTypes.Text })
  name: string

  @Field({ type: MappingTypes.Keyword })
  ownerNickname: string

  @Field({ type: MappingTypes.Keyword })
  typeimage1: string

  @Field({ type: MappingTypes.Keyword })
  typeimage2: string

  @Field({ type: MappingTypes.Keyword })
  typeimage3: string

  @Field({ type: MappingTypes.Keyword })
  urlimage1: string

  @Field({ type: MappingTypes.Keyword })
  urlimage2: string

  @Field({ type: MappingTypes.Keyword })
  urlimage3: string

  @Field({ type: MappingTypes.Keyword })
  userIdCreator: string
}
