import { Test } from '@nestjs/testing';
import { SearchService } from '../../search.service';
import { HistoryController } from './history.controller';

describe('HistoryController', () => {
  let controller: HistoryController;
  let searchService: SearchService;

  const mockHistory = ['query1', 'query2', 'query3'];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        {
          provide: SearchService,
          useValue: {
            getHistory: vi.fn().mockResolvedValue(mockHistory),
          },
        },
      ],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('getHistory', () => {
    it('should return user search history', async () => {
      const result = await controller.getHistory('test-user');
      expect(result).toEqual(mockHistory);
      expect(searchService.getHistory).toHaveBeenCalledWith('test-user');
    });

    it('should return empty array for new user', async () => {
      vi.spyOn(searchService, 'getHistory').mockResolvedValueOnce([]);
      const result = await controller.getHistory('new-user');
      expect(result).toEqual([]);
    });
  });
});
