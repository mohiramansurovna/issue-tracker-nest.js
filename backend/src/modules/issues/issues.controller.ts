import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { AuthTokenGuard } from '@/shared/guards/auth-token.guard';
import { CurrentUserId } from '@/shared/decorators/auth.decorator';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { GetIussesParamsDto } from './dto/get-issues.dto';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  async getAll(@Query() query: GetIussesParamsDto) {
    return await this.issuesService.getAll(query);
  }

  @Get(':id')
  async get(@Param() { id }: { id: string }) {
    return await this.issuesService.get(id);
  }

  @Post()
  @UseGuards(AuthTokenGuard)
  async createIssue(
    @CurrentUserId() userId: string,
    @Body() body: CreateIssueDto,
  ) {
    return await this.issuesService.create(userId, body);
  }

  @Put(':id')
  @UseGuards(AuthTokenGuard)
  async updateIssue(
    @CurrentUserId() userId: string,
    @Param() { id }: { id: string },
    @Body() body: UpdateIssueDto,
  ) {
    return await this.issuesService.update(userId, id, body);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  async deleteIssue(
    @CurrentUserId() userId: string,
    @Param() { id }: { id: string },
  ) {
    return await this.issuesService.deleteIssue(userId, id);
  }
}
