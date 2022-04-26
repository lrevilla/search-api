import { uuid } from '@peooplev2/types'
import { uuidv4 } from '@peooplev2/utils'

import { Field, Index } from '../decorators'
import { BaseIndex } from '../dto/base.index'
import { MappingTypes } from '../enum'
import { OpenSearchIndex } from '../interfaces/opensearch-index.interface'

@Index('users_v2', { NumberOfShards: 5 })
export class UsersV2Index extends BaseIndex implements OpenSearchIndex {
  @Field({ type: MappingTypes.Keyword })
  avatar_image: string

  @Field({ type: MappingTypes.Keyword })
  avatar_typeimage: string

  @Field({ type: MappingTypes.Keyword })
  avatar_urlimage: string

  @Field({ type: MappingTypes.Long })
  collectionscount: number

  @Field({ type: MappingTypes.Long })
  counter: number

  @Field({ type: MappingTypes.Keyword })
  fingerprint?: uuid = uuidv4()

  @Field({ type: MappingTypes.Long })
  level: number

  @Field({ type: MappingTypes.Text })
  name: string

  @Field({ type: MappingTypes.Keyword })
  nickname: string

  @Field({ type: MappingTypes.Long })
  timelinescount: number

  @Field({ type: MappingTypes.Keyword })
  topusers: string

  @Field({ type: MappingTypes.Text })
  username: string

  @Field({ type: MappingTypes.Text })
  usersurname: string

  @Field({ type: MappingTypes.Boolean })
  verified: boolean
}
