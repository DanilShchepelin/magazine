import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../config/app.config';
import databaseConfig from '../config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisOptions } from '../config/redis.config';
import { ArticlesModule } from './articles.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
};

describe('ArticlesService', () => {
  let service: ArticlesService;
  let userService: UsersService;
  let user: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
          load: [appConfig, databaseConfig],
        }),

        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => configService.get('database'),
        }),

        CacheModule.registerAsync(RedisOptions),

        AuthModule,

        ArticlesModule,

        UsersModule,
      ],
      controllers: [],
      providers: [{ provide: CACHE_MANAGER, useValue: mockCacheManager }],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    userService = module.get<UsersService>(UsersService);

    const userEntity = userService.repo.create({
      email: 'test@test.com',
      password: 'test',
      firstName: 'Test',
      lastName: 'Test',
    });
    user = await userService.repo.save(userEntity);
  });

  afterAll(() => {
    userService.repo.delete(user.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create article', async () => {
    console.log('зашел в тест');
    const article = await service.create({ title: 'Test', description: 'Test description' }, user);
    console.log('создал статью');
    const foundedArticle = await service.repo.findOne({
      where: { id: article.id },
      relations: { user: true },
    });

    expect(foundedArticle).toBe(article);
  });
});
