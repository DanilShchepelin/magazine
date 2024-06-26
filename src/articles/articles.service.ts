import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';
import { PageDto } from '../app/page.dto';
import { PageMetaDto } from '../app/page-meta.dto';
import { FilterDto } from './filter.dto';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity) readonly repo: Repository<ArticleEntity>,
  ) {}

  async findAll(pageOptionsDto: FilterDto): Promise<PageDto<ArticleEntity>> {
    const queryBuilder = this.repo.createQueryBuilder('articles');

    queryBuilder
      .orderBy('articles.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .setFindOptions({ relations: { user: true } });

    this.applyFilters(queryBuilder, pageOptionsDto);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMeta);
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    pageOptionsDto: FilterDto,
  ) {
    this.filterByTitle(queryBuilder, pageOptionsDto.title);
    this.filterByDescription(queryBuilder, pageOptionsDto.description);
    this.filterByPublishedStatus(queryBuilder, pageOptionsDto.published);
    this.filterByPublishedAt(queryBuilder, pageOptionsDto.publishedAt);
    this.filterByAuthor(queryBuilder, pageOptionsDto.authorName);
  }

  private filterByTitle(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    title: string | undefined,
  ) {
    if (title) {
      queryBuilder.where('articles.title ILIKE :title', {
        title: `%${title}%`,
      });
    }
  }

  private filterByDescription(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    description: string | undefined,
  ) {
    if (description) {
      queryBuilder.andWhere('articles.description ILIKE :description', {
        description: `%${description}%`,
      });
    }
  }

  private filterByPublishedStatus(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    published: boolean | undefined,
  ) {
    if (published !== undefined) {
      queryBuilder.andWhere({ published });
    }
  }

  private filterByPublishedAt(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    publishedAt: string | undefined,
  ) {
    if (publishedAt) {
      const { startDate, endDate } = this.getPublishedAtDates(publishedAt);
      queryBuilder.andWhere({ publishedAt: Between(startDate, endDate) });
    }
  }

  private filterByAuthor(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    authorName: string | undefined,
  ) {
    if (authorName) {
      queryBuilder.andWhere({ user: { firstName: authorName } });
    }
  }

  private getPublishedAtDates(publishedAt: string): {
    startDate: Date;
    endDate: Date;
  } {
    const date = new Date(publishedAt);
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 0));
    return { startDate, endDate };
  }

  public findOneById(id: number): Promise<ArticleEntity | null> {
    return this.repo.findOneBy({ id });
  }

  public findOneBySlug(slug: string): Promise<ArticleEntity | null> {
    return this.repo.findOneBy({ slug });
  }

  public create(
    article: CreateArticleDto,
    user: UserEntity,
  ): Promise<ArticleEntity> {
    const createInput = { ...article, userId: user.id };
    const model = this.repo.create(createInput);
    return this.repo.save(model);
  }

  public update(id: number, article: UpdateArticleDto): Promise<ArticleEntity> {
    const updateInput = { id, ...article };
    return this.repo.save(updateInput, { reload: true });
  }

  public delete(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
