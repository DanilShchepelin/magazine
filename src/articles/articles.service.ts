import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';
import { PageDto } from '../app/page.dto';
import { PageMetaDto } from '../app/page-meta.dto';
import { FilterDto } from './filter.dto';
import { UserEntity } from '../users/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity) readonly repo: Repository<ArticleEntity>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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

  private applyFilters(queryBuilder: SelectQueryBuilder<ArticleEntity>, filter: FilterDto) {
    this.filterByTitle(queryBuilder, filter.title);
    this.filterByDescription(queryBuilder, filter.description);
    this.filterByPublishedStatus(queryBuilder, filter.published);
    this.filterByPublishedAt(queryBuilder, filter.publishedAt);
    this.filterByAuthor(queryBuilder, filter.authorName);
  }

  private filterByTitle(
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    title: string | undefined,
  ) {
    if (title) {
      queryBuilder.andWhere('articles.title ILIKE :title', {
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

  public async findOneById(id: number): Promise<ArticleEntity | null> {
    const cachedData = await this.cacheService.get(id.toString());
    if (cachedData) {
      return cachedData as ArticleEntity;
    }
    const article = await this.repo.findOneBy({ id });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await this.cacheService.set(id.toString(), article, { ttl: 60 * 60 });
    return article;
  }

  public create(article: CreateArticleDto, user: UserEntity): Promise<ArticleEntity> {
    console.log('зашел в создание');
    if (!user) {
      throw new BadRequestException('User is not logged in');
    }
    console.log(article);
    console.log(user);
    const createInput = { ...article, userId: user.id };
    const model = this.repo.create(createInput);
    return this.repo.save(model);
  }

  public async update(id: number, article: UpdateArticleDto): Promise<ArticleEntity> {
    const updateInput = { id, ...article };
    const updatedItem = await this.repo.save(updateInput, { reload: true });
    const cachedDataById = await this.cacheService.get(id.toString());
    if (cachedDataById) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await this.cacheService.set(id.toString(), updatedItem, { ttl: 60 * 60 });
    }
    return updatedItem;
  }

  public async delete(id: number): Promise<DeleteResult> {
    const cachedData = await this.cacheService.get(id.toString());
    if (cachedData) {
      await this.cacheService.del(id.toString());
    }
    return this.repo.delete(id);
  }
}
