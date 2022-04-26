import { ConfigService } from '@nestjs/config'

import { RegisterOpenSearchType } from './register-opensearch.type'

export interface RegisterAsyncOpenSearch {
  useFactory?: (configService: ConfigService) => RegisterOpenSearchType | Promise<RegisterOpenSearchType>
}
