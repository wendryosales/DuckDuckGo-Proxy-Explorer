import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs/promises';
import { HistoryService } from './history.service';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

describe('HistoryService', () => {
  let service: HistoryService;

  const testUserId = 'test-user';
  const testQuery = 'test-query';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryService],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getHistory', () => {
    it('should return empty array when file does not exist', async () => {
      const error = new Error('File not found');
      (error as any).code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValueOnce(error);

      const result = await service.getHistory(testUserId);
      expect(result).toEqual([]);
    });

    it('should return user history when file exists', async () => {
      const mockHistory = {
        [testUserId]: ['query1', 'query2'],
      };
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockHistory));

      const result = await service.getHistory(testUserId);
      expect(result).toEqual(['query1', 'query2']);
    });

    it('should return empty array when user has no history', async () => {
      const mockHistory = {
        'other-user': ['query1', 'query2'],
      };
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockHistory));

      const result = await service.getHistory(testUserId);
      expect(result).toEqual([]);
    });

    it('should handle read errors gracefully and not throw an error', async () => {
      const error = new Error('Read error');
      vi.mocked(fs.readFile).mockRejectedValueOnce(error);

      const result = await service.getHistory(testUserId);
      expect(result).toEqual([]);
    });
  });

  describe('addToHistory', () => {
    it('should add new query to empty history', async () => {
      const error = new Error('File not found');
      (error as any).code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValueOnce(error);

      await service.addToHistory(testQuery, testUserId);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify({
          [testUserId]: [testQuery],
        }),
      );
    });

    it('should not add duplicate query', async () => {
      const existingHistory = {
        [testUserId]: [testQuery, 'old-query'],
      };
      vi.mocked(fs.readFile).mockResolvedValueOnce(
        JSON.stringify(existingHistory),
      );

      await service.addToHistory(testQuery, testUserId);

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should limit history to maxHistoryItems', async () => {
      const existingQueries = Array.from(
        { length: 10 },
        (_, i) => `query-${i}`,
      );
      const existingHistory = {
        [testUserId]: existingQueries,
      };
      vi.mocked(fs.readFile).mockResolvedValueOnce(
        JSON.stringify(existingHistory),
      );

      await service.addToHistory('new-query', testUserId);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('new-query'),
      );
      const writeFileCall = vi.mocked(fs.writeFile).mock.calls[0][1] as string;
      const savedHistory = JSON.parse(writeFileCall);
      expect(savedHistory[testUserId]).toHaveLength(10);
      expect(savedHistory[testUserId][0]).toBe('new-query');
    });

    it('should handle write errors gracefully and not throw an error', async () => {
      vi.mocked(fs.writeFile).mockRejectedValueOnce(new Error('Write error'));

      const result = await service.addToHistory(testQuery, testUserId);

      expect(result).toBeUndefined();
    });
  });
});
