import { LibraryApi } from '@test/library1_api';
import { Inject } from '@hld/loc';

@Inject()
export class LibraryApiImpl implements LibraryApi {
  getLibraryStr(): string {
    return "这是library1的内容"
  }
}