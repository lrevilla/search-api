import { IsEnum, IsDefined, IsOptional, IsBoolean, IsString } from 'class-validator'

import { MappingTypes } from '../enum'
import { FieldOptions } from '../interfaces'

export class FieldOptionsDto implements FieldOptions {
  @IsOptional()
  @IsString()
  name?: MappingTypes

  @IsDefined()
  @IsEnum(MappingTypes)
  type: MappingTypes

  @IsOptional()
  @IsBoolean()
  searchable?: boolean = false

  @IsDefined()
  @IsString()
  property: string
}
