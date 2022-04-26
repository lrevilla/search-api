import { Expose } from 'class-transformer'
import { IsOptional, IsNumber } from 'class-validator'

export class IndexOptionsDto {
  @IsOptional()
  @IsNumber()
  @Expose({ name: 'number_of_shards', toPlainOnly: true })
  NumberOfShards?: number

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'number_of_replicas', toPlainOnly: true })
  NumberOfReplicas?: number
}
