import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { FilterDto } from './filter.dto';
import { PageDto } from '../app/page.dto';
import { ArticleEntity } from './article.entity';

describe('ArticlesController', () => {
  let articlesController: ArticlesController;
  let articlesService: ArticlesService;

  beforeEach(() => {
    articlesService = new ArticlesService(null, null);
    articlesController = new ArticlesController(articlesService);
  });

  describe('findAll', () => {
    it('should return a PageDto with articles when called with valid FilterDto', async () => {
      const filterDto: FilterDto = {
        page: 1,
        take: 10,
        get skip(): number {
          return 0;
        },
      };
      const expectedResult: PageDto<ArticleEntity> = {
        data: [new ArticleEntity()],
        meta: {
          page: 1,
          take: 10,
          itemCount: 1,
          pageCount: 1,
          hasPrevious: false,
          hasNext: false,
        },
      };

      jest.spyOn(articlesService, 'findAll').mockResolvedValue(expectedResult);

      expect(await articlesController.findAll(filterDto)).toEqual(expectedResult);
      expect(articlesService.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should handle negative page and limit values by returning default page and limit', async () => {
      const filterDto: FilterDto = {
        page: -1,
        take: -10,
        get skip(): number {
          return 20;
        },
      };

      jest.spyOn(articlesService, 'findAll').mockRejectedValue(new Error('Bad Request'));

      await expect(articlesController.findAll(filterDto)).rejects.toThrow('Bad Request');
    });
  });
});
