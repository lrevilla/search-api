export interface MatchSearchOccurrence {
  match: {
    [key: string]: {
      query: string | number | boolean | Date
      fuzziness?: string | number
    }
  }
}
