import { LocProvider,Di } from '@hld/loc';
import { LibraryTestApiImpl } from '../LibraryTestApiImpl';
import { LibraryTestApi } from '../LibraryTestApi';
import { LibraryTestApiImpl2 } from '../LibraryTestApiImpl';

@Di
export class Library_testDi { 
  static getLibraryTestApiImpl(): LocProvider { 
    return (): LibraryTestApi => { 
      return new LibraryTestApiImpl() 
    } 
  } 
  static getLibraryTestApiImpl2(): LocProvider { 
    return (): LibraryTestApi => { 
      return new LibraryTestApiImpl2() 
    } 
  } 
} 
