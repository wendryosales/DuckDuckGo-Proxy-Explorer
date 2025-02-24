import { Injectable } from '@nestjs/common';
import { PaginateOptions } from '../shared/types/pagination';
import { Paginator } from '../shared/utils/paginator';
import { DuckDuckGoService } from './services/duckduckgo/duckduckgo.service';
import { HistoryService } from './services/history/history.service';

@Injectable()
export class SearchService {
  private readonly paginator: Paginator;

  constructor(
    private readonly duckDuckGoService: DuckDuckGoService,
    private readonly historyService: HistoryService,
  ) {
    this.paginator = new Paginator();
  }

  async search(query: string, userId: string, options?: PaginateOptions) {
    const { results } = await this.duckDuckGoService.search(query);
    await this.historyService.addToHistory(query, userId);
    return this.paginator.paginate(results, options);
  }

  async getHistory(userId: string): Promise<string[]> {
    return this.historyService.getHistory(userId);
  }
}
