import { api, unwrap } from './client';
import type { PagedResult, ProductListItem } from './types';

export interface ProductQueryParams {
  search?: string;
  idCategory?: string;
  page?: number;
  pageSize?: number;
}

export const productsApi = {
  list: (params: ProductQueryParams) =>
    unwrap<PagedResult<ProductListItem>>(api.get('/products', { params })),
};
