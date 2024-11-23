import { Inject } from '@hld/loc';

@Inject()
export class LibraryApiImpl1 {
  getLibraryStr(): string {
    return "这是library1的内容"
  }
}