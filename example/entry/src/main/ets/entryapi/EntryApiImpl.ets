import { Inject } from '@hld/loc';
import { EntryApi } from './EntryApi';

@Inject()
export class EntryApiImpl implements EntryApi{
  getEntryStr(): string {
    return "EntryApiImpl"
  }
}