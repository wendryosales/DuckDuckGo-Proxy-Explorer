import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';

import { HistoryController } from './controllers/history/history.controller';
import { SearchController } from './controllers/search/search.controller';
import { SearchService } from './search.service';
import { DuckDuckGoService } from './services/duckduckgo/duckduckgo.service';
import { HistoryService } from './services/history/history.service';

@Module({
  imports: [HttpModule, EnvModule],
  controllers: [SearchController, HistoryController],
  providers: [SearchService, DuckDuckGoService, HistoryService],
})
export class SearchModule {}
