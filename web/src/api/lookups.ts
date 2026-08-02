import { api, unwrap } from './client';
import type { LookupItem } from './types';

export const lookupsApi = {
  categories: () => unwrap<LookupItem[]>(api.get('/categories')),
  genders: () => unwrap<LookupItem[]>(api.get('/genders')),
  payments: () => unwrap<LookupItem[]>(api.get('/payments')),
};
