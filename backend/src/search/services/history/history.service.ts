import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

interface UserHistory {
  [userId: string]: string[];
}

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);
  private readonly historyFile = path.join(
    process.cwd(),
    'search-history.json',
  );
  private readonly maxHistoryItems = 10;

  async addToHistory(query: string, userId: string): Promise<void> {
    try {
      const allHistory = await this.getAllHistory();
      const userHistory = allHistory[userId] || [];

      if (!userHistory.includes(query)) {
        userHistory.unshift(query);
        allHistory[userId] = userHistory.slice(0, this.maxHistoryItems);
        await fs.writeFile(this.historyFile, JSON.stringify(allHistory));
      }
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error saving search history: ${err.message}`,
        err.stack,
      );
    }
  }

  async getHistory(userId: string): Promise<string[]> {
    const allHistory = await this.getAllHistory();
    return allHistory[userId] || [];
  }

  private async getAllHistory(): Promise<UserHistory> {
    try {
      const data = await fs.readFile(this.historyFile, 'utf-8');
      return JSON.parse(data);
    } catch (error: unknown) {
      const err = error as { code?: string } & Error;
      if (err.code === 'ENOENT') {
        return {};
      }
      this.logger.error(
        `Error reading search history: ${err.message}`,
        err.stack,
      );
      return {};
    }
  }
}
