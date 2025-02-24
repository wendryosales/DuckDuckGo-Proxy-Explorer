import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { of, throwError } from 'rxjs';
import { EnvService } from '../../../env/env.service';
import { DuckDuckGoService } from './duckduckgo.service';
import { DuckDuckGoResponse, DuckDuckGoTopic } from './types/search';

describe('DuckDuckGoService', () => {
  let service: DuckDuckGoService;
  let httpService: HttpService;
  let envService: EnvService;

  const mockBaseUrl = 'http://test.api.com';
  const mockFormat = 'json';
  const testQuery = 'test query';

  const createMockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: {} as any,
    } as InternalAxiosRequestConfig,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DuckDuckGoService,
        {
          provide: HttpService,
          useValue: {
            get: vi.fn(),
          },
        },
        {
          provide: EnvService,
          useValue: {
            get: vi.fn((key: string) => {
              switch (key) {
                case 'DUCKDUCKGO_BASE_URL':
                  return mockBaseUrl;
                case 'DUCKDUCKGO_FORMAT':
                  return mockFormat;
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DuckDuckGoService>(DuckDuckGoService);
    httpService = module.get<HttpService>(HttpService);
    envService = module.get<EnvService>(EnvService);
  });

  describe('search', () => {
    it('should process simple results correctly', async () => {
      const mockResponse: DuckDuckGoResponse = {
        RelatedTopics: [
          {
            FirstURL: 'http://example.com/1',
            Text: 'Example 1',
          },
          {
            FirstURL: 'http://example.com/2',
            Text: 'Example 2',
          },
        ],
      };

      vi.spyOn(httpService, 'get').mockReturnValueOnce(
        of(createMockAxiosResponse(mockResponse)),
      );

      const result = await service.search(testQuery);

      expect(result.results).toHaveLength(2);
      expect(result.categories).toHaveLength(0);
      expect(result.results[0]).toEqual({
        url: 'http://example.com/1',
        title: 'Example 1',
      });
    });

    it('should process categorized results correctly', async () => {
      const mockResponse: DuckDuckGoResponse = {
        RelatedTopics: [
          {
            FirstURL: '',
            Text: '',
            Name: 'Category 1',
            Topics: [
              {
                FirstURL: 'http://example.com/1',
                Text: 'Example 1',
              },
              {
                FirstURL: 'http://example.com/2',
                Text: 'Example 2',
              },
            ],
          } as DuckDuckGoTopic,
        ],
      };

      vi.spyOn(httpService, 'get').mockReturnValueOnce(
        of(createMockAxiosResponse(mockResponse)),
      );

      const result = await service.search(testQuery);

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe('Category 1');
      expect(result.categories[0].results).toHaveLength(2);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].category).toBe('Category 1');
    });

    it('should handle mixed results (categorized and uncategorized)', async () => {
      const mockResponse: DuckDuckGoResponse = {
        RelatedTopics: [
          {
            FirstURL: 'http://example.com/1',
            Text: 'Example 1',
          },
          {
            FirstURL: '',
            Text: '',
            Name: 'Category 1',
            Topics: [
              {
                FirstURL: 'http://example.com/2',
                Text: 'Example 2',
              },
            ],
          } as DuckDuckGoTopic,
        ],
      };

      vi.spyOn(httpService, 'get').mockReturnValueOnce(
        of(createMockAxiosResponse(mockResponse)),
      );

      const result = await service.search(testQuery);

      expect(result.results).toHaveLength(2);
      expect(result.categories).toHaveLength(1);
      expect(result.results[0].category).toBeUndefined();
      expect(result.results[1].category).toBe('Category 1');
    });

    it('should throw error when API response is invalid', async () => {
      vi.spyOn(httpService, 'get').mockReturnValueOnce(
        of(createMockAxiosResponse({})),
      );

      await expect(service.search(testQuery)).rejects.toThrow(
        'Invalid API response format',
      );
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      vi.spyOn(httpService, 'get').mockReturnValueOnce(throwError(() => error));

      await expect(service.search(testQuery)).rejects.toThrow('API Error');
    });

    it('should use correct URL and parameters', async () => {
      const getSpy = vi
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(
          of(createMockAxiosResponse({ RelatedTopics: [] })),
        );

      await service.search(testQuery);

      expect(getSpy).toHaveBeenCalledWith(mockBaseUrl, {
        params: {
          q: testQuery,
          format: mockFormat,
        },
      });
    });
  });
});
