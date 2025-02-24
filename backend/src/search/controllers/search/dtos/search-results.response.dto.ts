import { ApiProperty } from '@nestjs/swagger';

class SearchResult {
  @ApiProperty({ example: 'Duck Search' })
  title: string;

  @ApiProperty({ example: 'https://duckduckgo.com' })
  url: string;

  @ApiProperty({ example: 'Search Engine' })
  category?: string;
}

class SearchResultsMeta {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  lastPage: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: null })
  prev: number | null;

  @ApiProperty({ example: 2 })
  next: number | null;
}

export class SearchResultsResponseDto {
  @ApiProperty({ type: SearchResultsMeta })
  meta: SearchResultsMeta;

  @ApiProperty({ type: [SearchResult] })
  results: SearchResult[];
}
