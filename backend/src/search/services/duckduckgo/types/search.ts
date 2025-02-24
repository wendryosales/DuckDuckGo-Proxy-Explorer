export interface SearchResult {
  url: string;
  title: string;
  category?: string;
}

export interface CategoryGroup {
  name: string;
  results: SearchResult[];
}

export interface SearchResults {
  results: SearchResult[];
  categories: CategoryGroup[];
}

// Types from DuckDuckGo API
export interface DuckDuckGoTopic {
  FirstURL: string;
  Text: string;
  Name?: string;
  Topics?: DuckDuckGoTopic[];
}

export interface DuckDuckGoResponse {
  RelatedTopics: DuckDuckGoTopic[];
  Abstract?: string;
  AbstractText?: string;
  AbstractSource?: string;
  AbstractURL?: string;
  Image?: string;
}
