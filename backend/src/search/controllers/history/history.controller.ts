import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserId } from 'src/shared/decorators/user-id.decorator';
import { ResponseDescription } from 'src/shared/types/response-description';
import { SearchService } from '../../search.service';

@Controller('search/history')
export class HistoryController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [String],
    isArray: true,
    description: ResponseDescription.OK,
  })
  async getHistory(@UserId() userId: string) {
    return this.searchService.getHistory(userId);
  }
}
