import { uuid } from '@peooplev2/types'

export interface OpenSearchIndex {
  id?: uuid

  [x: string]: any
}
