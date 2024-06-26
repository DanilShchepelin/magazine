import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';
import { PageDto } from '../app/page.dto';
import { FilterDto } from './filter.dto';

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

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlug(slug);
  }

  @Post()
  create(@Body() article: CreateArticleDto): Promise<ArticleEntity> {
    return this.articlesService.create(article);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() article: UpdateArticleDto) {
    return this.articlesService.update(Number(id), article);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.articlesService.delete(Number(id));
  }
}
