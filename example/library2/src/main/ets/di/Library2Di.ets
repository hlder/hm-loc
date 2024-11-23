import { LocProvider,Di } from '@hld/loc';
import { TestApi1Impl } from '../api/TestApi1Impl';
import { TestApi } from '../TestApi';
import { TestApi2Impl } from '../api/TestApi2Impl';
import { TestApi2 } from '../api/TestApi2';
import { TestApiImpl } from '../TestApiImpl';

@Di
export class Library2Di { 
  static getTestApi1Impl(): LocProvider { 
    return (): TestApi => { 
      return new TestApi1Impl() 
    } 
  } 
  static getTestApi2Impl(): LocProvider { 
    return (): TestApi2 => { 
      return new TestApi2Impl() 
    } 
  } 
  static getTestApiImpl(): LocProvider { 
    return (): TestApi => { 
      return new TestApiImpl() 
    } 
  } 
} 
