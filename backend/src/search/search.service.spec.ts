import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { DuckDuckGoService } from './services/duckduckgo/duckduckgo.service';
import { SearchResult } from './services/duckduckgo/types/search';
import { HistoryService } from './services/history/history.service';

describe('SearchService', () => {
  let service: SearchService;
  let duckDuckGoService: DuckDuckGoService;
  let historyService: HistoryService;

  const mockResults: SearchResult[] = [
    { url: 'http://example.com/1', title: 'Example 1' },
    { url: 'http://example.com/2', title: 'Example 2' },
  ];

  const testQuery = 'test query';
  const testUserId = 'test-user';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: DuckDuckGoService,
          useValue: {
            search: vi
              .fn()
              .mockResolvedValue({ results: mockResults, categories: [] }),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            addToHistory: vi.fn(),
            getHistory: vi.fn().mockResolvedValue(['previous search']),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    duckDuckGoService = module.get<DuckDuckGoService>(DuckDuckGoService);
    historyService = module.get<HistoryService>(HistoryService);
  });

  describe('search', () => {
    it('should return search results with pagination', async () => {
      const result = await service.search(testQuery, testUserId, {
        page: 1,
        perPage: 1,
      });

      expect(result.results).toHaveLength(1);
      expect(result.meta.total).toBe(2);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.perPage).toBe(1);
      expect(result.meta.lastPage).toBe(2);
      expect(result.meta.next).toBe(2);
      expect(result.meta.prev).toBeNull();
    });

    it('should use default pagination when no options provided', async () => {
      const result = await service.search(testQuery, testUserId);

      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.perPage).toBe(10);
    });

    it('should add search to history', async () => {
      await service.search(testQuery, testUserId);

      expect(historyService.addToHistory).toHaveBeenCalledWith(
        testQuery,
        testUserId,
      );
    });

    it('should paginate correctly for different pages', async () => {
      const manyResults = Array.from({ length: 25 }, (_, i) => ({
        url: `http://example.com/${i}`,
        title: `Example ${i}`,
      }));

      vi.spyOn(duckDuckGoService, 'search').mockResolvedValueOnce({
        results: manyResults,
        categories: [],
      });

      const result = await service.search(testQuery, testUserId, {
        page: 2,
        perPage: 10,
      });

      expect(result.results).toHaveLength(10);
      expect(result.meta.total).toBe(25);
      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.lastPage).toBe(3);
      expect(result.meta.prev).toBe(1);
      expect(result.meta.next).toBe(3);
    });
  });

  describe('getHistory', () => {
    it('should return user search history', async () => {
      const history = await service.getHistory(testUserId);

      expect(history).toEqual(['previous search']);
      expect(historyService.getHistory).toHaveBeenCalledWith(testUserId);
    });
  });
});
