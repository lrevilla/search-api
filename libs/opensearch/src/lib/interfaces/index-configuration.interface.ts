import { IndexOptions } from './index-options.interface'

export interface IndexConfiguration {
  index: string
  body: {
    settings: {
      index: IndexOptions
    }
  }
}
