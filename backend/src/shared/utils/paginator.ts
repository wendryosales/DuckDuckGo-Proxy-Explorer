import { PaginatedResult, PaginateOptions } from '../types/pagination';

export class Paginator {
  private defaultOptions: PaginateOptions;

  constructor(defaultOptions: PaginateOptions = { page: 1, perPage: 10 }) {
    this.defaultOptions = defaultOptions;
  }

  public paginate<T>(
    items: T[],
    options?: PaginateOptions,
  ): PaginatedResult<T> {
    const page = Number(options?.page || this.defaultOptions.page) || 1;
    const perPage =
      Number(options?.perPage || this.defaultOptions.perPage) || 10;

    const total = items.length;
    const lastPage = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const results = items.slice(startIndex, startIndex + perPage);

    return {
      results,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  }
}
