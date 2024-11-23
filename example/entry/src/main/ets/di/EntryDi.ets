import { LocProvider,Di } from '@hld/loc';
import { EntryApiImpl } from '../entryapi/EntryApiImpl';
import { EntryApi } from '../entryapi/EntryApi';

@Di
export class EntryDi { 
  static getEntryApiImpl(): LocProvider { 
    return (): EntryApi => { 
      return new EntryApiImpl() 
    } 
  } 
} 
