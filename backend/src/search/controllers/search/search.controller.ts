import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ResponseDescription } from 'src/shared/types/response-description';
import { UserId } from '../../../shared/decorators/user-id.decorator';
import { SearchService } from '../../search.service';
import { SearchQueryDto } from './dtos/search-query.dto';
import { SearchResultsResponseDto } from './dtos/search-results.response.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SearchResultsResponseDto,
    description: ResponseDescription.OK,
  })
  async searchGet(@Query() query: SearchQueryDto, @UserId() userId: string) {
    return this.searchService.search(query.q, userId, {
      page: query.page,
      perPage: query.perPage,
    });
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SearchResultsResponseDto,
    description: ResponseDescription.OK,
  })
  async searchPost(@Body() body: SearchQueryDto, @UserId() userId: string) {
    return this.searchService.search(body.q, userId, {
      page: body.page,
      perPage: body.perPage,
    });
  }
}
