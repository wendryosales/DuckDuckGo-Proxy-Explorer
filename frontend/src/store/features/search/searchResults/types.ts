export interface SearchResult {
  title: string;
  url: string;
  category?: string;
}

export interface SearchMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export interface SearchResultsState {
  results: SearchResult[];
  meta: SearchMeta | null;
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
  currentQuery: string;
}
