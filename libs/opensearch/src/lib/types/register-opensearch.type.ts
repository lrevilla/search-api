export interface RegisterOpenSearch {
  host: string
  pingTimeout: number
  autoCreateIndices: boolean
  mode?: 'aws'
}

export interface RegisterOpenSearchAws {
  host: string
  pingTimeout: number
  autoCreateIndices: boolean
  mode: 'aws'
  awsRegion: string
  awsKey: string
  awsSecret: string
}

export type RegisterOpenSearchType = RegisterOpenSearchAws | RegisterOpenSearch
