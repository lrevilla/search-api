import { uuid } from '@peooplev2/types'
import { uuidv4 } from '@peooplev2/utils'

import { Field, Index } from '../decorators'
import { BaseIndex } from '../dto'
import { MappingTypes } from '../enum'
import { OpenSearchIndex } from '../interfaces/opensearch-index.interface'

@Index('top_products_v2', { NumberOfShards: 5 })
export class TopProductsV2Index extends BaseIndex implements OpenSearchIndex {
  @Field({ type: MappingTypes.Keyword })
  address: string

  @Field({ type: MappingTypes.Keyword })
  artists: string

  @Field({ type: MappingTypes.Keyword })
  autor: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_en: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_es: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_fr: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_pt: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_timeline_en: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_timeline_es: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_timeline_fr: string

  @Field({ type: MappingTypes.Keyword })
  avatar_image_timeline_pt: string

  @Field({ type: MappingTypes.Keyword })
  city: string

  @Field({ type: MappingTypes.Long })
  counter: number

  @Field({ type: MappingTypes.Keyword })
  cta: string

  @Field({ type: MappingTypes.Keyword })
  fingerprint?: uuid = uuidv4()

  @Field({ type: MappingTypes.Keyword })
  flag3: string

  @Field({ type: MappingTypes.Keyword })
  genius_id: string

  @Field({ type: MappingTypes.Keyword })
  homepage: string

  @Field({ type: MappingTypes.Keyword })
  image: string

  @Field({ type: MappingTypes.Keyword })
  imagen_timeline: string

  @Field({ type: MappingTypes.Keyword })
  marca: string

  @Field({ type: MappingTypes.Text })
  name: string

  @Field({ type: MappingTypes.Keyword })
  name_en: string

  @Field({ type: MappingTypes.Keyword })
  name_es: string

  @Field({ type: MappingTypes.Keyword })
  name_fr: string

  @Field({ type: MappingTypes.Keyword })
  name_pt: string

  @Field({ type: MappingTypes.Keyword })
  phone: string

  @Field({ type: MappingTypes.Keyword })
  profesional_categoria_id: string

  @Field({ type: MappingTypes.Keyword })
  profesional_nombre: string

  @Field({ type: MappingTypes.Keyword })
  profesional_subcategoria_id: string

  @Field({ type: MappingTypes.Keyword })
  ratio_image_pocket: string

  @Field({ type: MappingTypes.Long })
  ratio_image_pocket_en: number

  @Field({ type: MappingTypes.Long })
  ratio_image_pocket_es: number

  @Field({ type: MappingTypes.Long })
  ratio_image_pocket_fr: number

  @Field({ type: MappingTypes.Long })
  ratio_image_pocket_pt: number

  @Field({ type: MappingTypes.Keyword })
  ratio_image_timeline: string

  @Field({ type: MappingTypes.Long })
  ratio_image_timeline_en: number

  @Field({ type: MappingTypes.Long })
  ratio_image_timeline_es: number

  @Field({ type: MappingTypes.Long })
  ratio_image_timeline_fr: number

  @Field({ type: MappingTypes.Long })
  ratio_image_timeline_pt: number

  @Field({ type: MappingTypes.Keyword })
  subcategory_name: string

  @Field({ type: MappingTypes.Keyword })
  typeimage: string

  @Field({ type: MappingTypes.Keyword })
  typeimage_timeline: string

  @Field({ type: MappingTypes.Keyword })
  url: string

  @Field({ type: MappingTypes.Keyword })
  urlimage: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_en: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_es: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_fr: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_pt: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_timeline: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_timeline_en: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_timeline_es: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_timeline_fr: string

  @Field({ type: MappingTypes.Keyword })
  urlimage_timeline_pt: string
}
