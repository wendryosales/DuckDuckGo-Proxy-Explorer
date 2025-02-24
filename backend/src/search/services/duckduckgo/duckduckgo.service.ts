import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { EnvService } from '../../../env/env.service';
import {
  CategoryGroup,
  DuckDuckGoResponse,
  DuckDuckGoTopic,
  SearchResult,
  SearchResults,
} from './types/search';

@Injectable()
export class DuckDuckGoService {
  private readonly logger = new Logger(DuckDuckGoService.name);
  private readonly baseUrl: string;
  private readonly format: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {
    this.baseUrl = this.envService.get('DUCKDUCKGO_BASE_URL');
    this.format = this.envService.get('DUCKDUCKGO_FORMAT');
  }

  async search(query: string): Promise<SearchResults> {
    try {
      const response = await this.fetchFromDuckDuckGo(query);
      return this.processSearchResults(response);
    } catch (error: unknown) {
      const err = error as Error;
      const errorMessage = err?.message || 'Unknown error';
      this.logger.error(
        `Failed to fetch search results: ${errorMessage}`,
        err.stack,
      );
      throw error;
    }
  }

  private async fetchFromDuckDuckGo(
    query: string,
  ): Promise<DuckDuckGoResponse> {
    const response = await firstValueFrom(
      this.httpService.get<DuckDuckGoResponse>(this.baseUrl, {
        params: {
          q: query,
          format: this.format,
        },
      }),
    );

    if (!response.data || !response.data.RelatedTopics) {
      throw new Error('Invalid API response format');
    }

    return response.data;
  }

  private processSearchResults(response: DuckDuckGoResponse): SearchResults {
    const allResults: SearchResult[] = [];
    const categories: CategoryGroup[] = [];

    response.RelatedTopics.forEach((topic) => {
      if (Boolean(topic.Name && topic.Topics)) {
        const categoryGroup = this.processCategoryTopic(topic);
        categories.push(categoryGroup);
        allResults.push(...categoryGroup.results);
      } else {
        allResults.push(this.mapTopicToSearchResult(topic));
      }
    });

    return { results: allResults, categories };
  }

  private processCategoryTopic(topic: DuckDuckGoTopic): CategoryGroup {
    const categoryResults = topic.Topics!.map((t) => ({
      url: t.FirstURL,
      title: t.Text,
      category: topic.Name,
    }));

    return {
      name: topic.Name!,
      results: categoryResults,
    };
  }

  private mapTopicToSearchResult(topic: DuckDuckGoTopic): SearchResult {
    return {
      url: topic.FirstURL,
      title: topic.Text,
    };
  }
}
