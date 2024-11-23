import { LocProvider,Di } from '@hld/loc';
import { LibraryApiImpl } from '../api/LibraryApiImpl';
import { LibraryApi } from '@test/library1_api';
import { LibraryApiImpl1 } from '../api/LibraryApiImpl1';
import { LibraryApiImpl2 } from '../api/LibraryApiImpl2';

@Di
export class Library1Di { 
  static getLibraryApiImpl(): LocProvider { 
    return (): LibraryApi => { 
      return new LibraryApiImpl() 
    } 
  } 
  static getLibraryApiImpl1(): LocProvider { 
    return (): LibraryApiImpl1 => { 
      return new LibraryApiImpl1() 
    } 
  } 
  static getLibraryApiImpl2(): LocProvider { 
    return (): LibraryApi => { 
      return new LibraryApiImpl2() 
    } 
  } 
} 
