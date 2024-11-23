import { LibraryApi } from '@test/library1_api'
import { Loc, get } from '@hld/loc'

export class LibraryUtils {
  getLibrary1Str(): string {
    return get<LibraryApi>(Loc.LibraryApi)?.getLibraryStr()
  }
}