import { LibraryApi } from '@test/library1_api';
import { Inject } from '@hld/loc';

@Inject("test/LibraryApiImpl2")
export class LibraryApiImpl2 implements LibraryApi {
  getLibraryStr(): string {
    return "这是library1的内容test2"
  }
}