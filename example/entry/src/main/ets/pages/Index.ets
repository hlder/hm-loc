import { LibraryApi } from '@test/library1_api/Index';
import { LibraryUtils } from '@test/library2';
import { LibraryTestApi } from '@test/library_test';
import { get, Loc } from '@hld/loc';
import { EntryApi } from '../entryapi/EntryApi';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World';
  private libraryUtils: LibraryUtils = new LibraryUtils()
  @State nowSelectedIndex: number = -1
  private libraryApi: LibraryApi = get<LibraryApi>("test/LibraryApiImpl2")
  private libraryTestApi: LibraryTestApi = get<LibraryTestApi>(Loc.LibraryTestApi)
  private libraryTestApi2: LibraryTestApi = get<LibraryTestApi>("LibraryTestApiImpl2")
  private entryApi: EntryApi = get<EntryApi>(Loc.EntryApi)

  build() {
    Column() {
      Text("libraryUtils:" + this.libraryUtils.getLibrary1Str())
        .padding(10)
      Text("libraryApi:" + this.libraryApi?.getLibraryStr())
        .padding(10)
      Text("entryApi:" + this.entryApi?.getEntryStr())
        .padding(10)
      this.libraryTestApi.getView().builder("libraryTestApi")
      this.libraryTestApi2.getView().builder("libraryTestApi2")
    }.alignItems(HorizontalAlign.Start)
    .height('100%')
    .width('100%')
  }
}