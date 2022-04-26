import { classToPlain, plainToClass } from 'class-transformer'
import _ from 'lodash'

import { IndexOptionsDto } from '../dto'
import { IndexConfiguration, OpenSearchIndex } from '../interfaces'
import { IndexStoreService } from '../service'

export function Index (name?: string): ClassDecorator
export function Index (options?: IndexOptionsDto): ClassDecorator
export function Index (name?: string, options?: IndexOptionsDto): ClassDecorator
export function Index (nameOrOptions?: string | IndexOptionsDto, options: IndexOptionsDto = {}): ClassDecorator {
  const areOptionsFirstParameter = nameOrOptions && typeof nameOrOptions === 'object'

  const name = (areOptionsFirstParameter ? null : nameOrOptions) as string
  options = (areOptionsFirstParameter ? nameOrOptions : options) as IndexOptionsDto

  return <T> (target: T & OpenSearchIndex & { name: string }) => {
    const baseIndexConfiguration = Reflect.getMetadata(target.name, Object.getPrototypeOf(target)) || {}
    const currentIndexconfiguration: IndexConfiguration = {
      index: (name || target.name).toLowerCase(),
      body: { settings: { index: options } }
    }
    const configuration: IndexConfiguration = _.merge(baseIndexConfiguration, currentIndexconfiguration)
    configuration.body.settings.index = classToPlain(plainToClass(IndexOptionsDto, configuration.body.settings.index))

    if (IndexStoreService.store.get(configuration.index)) {
      throw new Error(`there is an already existing index named ${configuration.index}`)
    }

    if (configuration.index !== 'base') {
      IndexStoreService.store.set(configuration.index, target)
    }

    return Reflect.defineMetadata(target.name, configuration, target)
  }
}
