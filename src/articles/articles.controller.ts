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
import { QueryDto } from './query.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Получить все статьи.
   *
   * @param filterDto - Параметры фильтров и страницы.
   * @returns Список статей с параметрами страницы.
   */
  @Get()
  @ApiOperation({
    summary: 'Получить все статьи',
  })
  @ApiOkResponse({
    description: 'При успешном запросе отображается список статей и параметры страницы',
  })
  findAll(@Query() filterDto: QueryDto): Promise<PageDto<ArticleEntity>> {
    return this.articlesService.findAll(filterDto);
  }

  /**
   * Получить статью по ID.
   *
   * @param id - ID статьи.
   * @returns Найденная статья.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Получить статью по ID',
  })
  @ApiOkResponse({
    description: 'При успешном запросе отображается найденная по ID статья',
  })
  findOneById(@Param('id') id: string) {
    return this.articlesService.findOneById(Number(id));
  }

  /**
   * Создание статьи.
   *
   * @param article - Данные статьи для создания.
   * @param req - Request.
   * @returns Созданная статья.
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Создание статьи',
  })
  @ApiCreatedResponse({
    description: 'При успешном запросе отображается созданная статья',
  })
  create(@Body() article: CreateArticleDto, @Request() req: any): Promise<ArticleEntity> {
    return this.articlesService.create(article, req.user);
  }

  /**
   * Изменение данных статьи.
   *
   * @param id - ID статьи.
   * @param article - Данные статьи для изменения.
   * @returns Измененная статья.
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Изменение данных статьи',
  })
  @ApiOkResponse({
    description: 'При успешном запросе отображается измененная статья',
  })
  update(@Param('id') id: string, @Body() article: UpdateArticleDto): Promise<ArticleEntity> {
    return this.articlesService.update(Number(id), article);
  }

  /**
   * Удаление статьи.
   *
   * @param id - ID статьи.
   * @returns Результат удаления.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Удаление статьи',
  })
  @ApiOkResponse({
    description: 'При успешном запросе отображается результат удаления',
  })
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.articlesService.delete(Number(id));
  }
}
