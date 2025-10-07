// apps/api/src/test/factories/pagination.factory.ts

import { Pagination } from 'nestjs-typeorm-paginate';

export function createMockPagination<T>(
  items: T[],
  route: string,
  overrides?: Partial<Pagination<T>>
): Pagination<T> {
  const totalItems = overrides?.meta?.totalItems ?? items.length;
  const itemsPerPage = overrides?.meta?.itemsPerPage ?? 10;
  const currentPage = overrides?.meta?.currentPage ?? 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    items,
    meta: {
      itemCount: items.length,
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
      ...overrides?.meta,
    },
    links: {
      first: `${route}?page=1&limit=${itemsPerPage}`,
      previous:
        currentPage > 1
          ? `${route}?page=${currentPage - 1}&limit=${itemsPerPage}`
          : '',
      next:
        currentPage < totalPages
          ? `${route}?page=${currentPage + 1}&limit=${itemsPerPage}`
          : '',
      last: `${route}?page=${totalPages}&limit=${itemsPerPage}`,
      ...overrides?.links,
    },
    ...overrides,
  };
}
