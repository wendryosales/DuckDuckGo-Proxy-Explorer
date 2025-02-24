import { Test } from '@nestjs/testing';
import { SearchService } from '../../search.service';
import { SearchResult } from '../../services/duckduckgo/types/search';
import { SearchController } from './search.controller';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;

  const mockSearchResults: SearchResult[] = [
    { url: 'http://example.com/1', title: 'Example 1' },
    { url: 'http://example.com/2', title: 'Example 2' },
  ];

  const mockPaginatedResponse = {
    results: mockSearchResults,
    meta: {
      total: 2,
      lastPage: 1,
      currentPage: 1,
      perPage: 10,
      prev: null,
      next: null,
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {
            search: vi.fn().mockResolvedValue(mockPaginatedResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('searchGet', () => {
    it('should return search results', async () => {
      const result = await controller.searchGet(
        { q: 'test query' },
        'test-user',
      );
      expect(result).toEqual(mockPaginatedResponse);
      expect(searchService.search).toHaveBeenCalledWith(
        'test query',
        'test-user',
        expect.any(Object),
      );
    });

    it('should handle pagination parameters', async () => {
      const result = await controller.searchGet(
        { q: 'test query', page: 2, perPage: 5 },
        'test-user',
      );
      expect(result).toEqual(mockPaginatedResponse);
      expect(searchService.search).toHaveBeenCalledWith(
        'test query',
        'test-user',
        {
          page: 2,
          perPage: 5,
        },
      );
    });
  });

  describe('searchPost', () => {
    it('should return search results', async () => {
      const result = await controller.searchPost(
        { q: 'test query' },
        'test-user',
      );
      expect(result).toEqual(mockPaginatedResponse);
      expect(searchService.search).toHaveBeenCalledWith(
        'test query',
        'test-user',
        expect.any(Object),
      );
    });

    it('should handle pagination parameters', async () => {
      const result = await controller.searchPost(
        { q: 'test query', page: 2, perPage: 5 },
        'test-user',
      );
      expect(result).toEqual(mockPaginatedResponse);
      expect(searchService.search).toHaveBeenCalledWith(
        'test query',
        'test-user',
        {
          page: 2,
          perPage: 5,
        },
      );
    });
  });
});
