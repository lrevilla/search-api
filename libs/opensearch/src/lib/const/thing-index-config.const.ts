// This file is kept here because removing it causes typescript compilation to fail
import { ProductToSetMap } from '../map'
export const ThingIndexConfiguration = { number_of_shards: Object.keys(ProductToSetMap).length + 1 }
