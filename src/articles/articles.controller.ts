import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';
import { PageDto } from '../app/page.dto';
import { FilterDto } from './filter.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query() filterDto: FilterDto): Promise<PageDto<ArticleEntity>> {
    return this.articlesService.findAll(filterDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.articlesService.findOneById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() article: CreateArticleDto, @Request() req: any): Promise<ArticleEntity> {
    return this.articlesService.create(article, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() article: UpdateArticleDto) {
    return this.articlesService.update(Number(id), article);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.articlesService.delete(Number(id));
  }
}
