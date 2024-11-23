import { Loc, LocInit } from '@hld/loc';
import { Library1Di } from '@test/library1';
import { Library2Di } from '@test/library2';
import { Library_testDi } from '@test/library_test';
import { EntryDi } from './EntryDi';

export class EntryLocInit {
  static init() {
    Loc["LibraryApi"] = "LibraryApi"
    LocInit.addProvider(Loc["LibraryApi"], Library1Di.getLibraryApiImpl())
    Loc["LibraryApiImpl1"] = "LibraryApiImpl1"
    LocInit.addProvider(Loc["LibraryApiImpl1"], Library1Di.getLibraryApiImpl1())
    Loc["test/LibraryApiImpl2"] = "test/LibraryApiImpl2"
    LocInit.addProvider(Loc["test/LibraryApiImpl2"], Library1Di.getLibraryApiImpl2())
    Loc["TestApi1Impl"] = "TestApi1Impl"
    LocInit.addProvider(Loc["TestApi1Impl"], Library2Di.getTestApi1Impl())
    Loc["TestApi2"] = "TestApi2"
    LocInit.addProvider(Loc["TestApi2"], Library2Di.getTestApi2Impl())
    Loc["TestApi"] = "TestApi"
    LocInit.addProvider(Loc["TestApi"], Library2Di.getTestApiImpl())
    Loc["LibraryTestApi"] = "LibraryTestApi"
    LocInit.addProvider(Loc["LibraryTestApi"], Library_testDi.getLibraryTestApiImpl())
    Loc["LibraryTestApiImpl2"] = "LibraryTestApiImpl2"
    LocInit.addProvider(Loc["LibraryTestApiImpl2"], Library_testDi.getLibraryTestApiImpl2())
    Loc["EntryApi"] = "EntryApi"
    LocInit.addProvider(Loc["EntryApi"], EntryDi.getEntryApiImpl())
  }
}
