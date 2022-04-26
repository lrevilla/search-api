export interface SingleTermSearchOccurrence {
  term: { [key: string]: string }
}
export interface MultiTermSearchOccurrence {
  terms: { [key: string]: string[] }
}
