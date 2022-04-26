import { OpenSearchIndex } from '../../interfaces'

export class IndexStoreService {
  private static readonly _store = new Map<string, OpenSearchIndex>()

  public static get store (): Map<string, OpenSearchIndex> {
    return this._store
  }
}
