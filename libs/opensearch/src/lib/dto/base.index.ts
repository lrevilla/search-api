import { uuid } from '@peooplev2/types'

import { Field, Index, Primary } from '../decorators'
import { MappingTypes } from '../enum'
import { OpenSearchIndex } from '../interfaces'

@Index('base', { NumberOfReplicas: 1, NumberOfShards: 1 })
export class BaseIndex implements OpenSearchIndex {
  @Primary()
  @Field({ type: MappingTypes.Keyword, searchable: true })
  id: uuid
}
