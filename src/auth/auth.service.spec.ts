import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';
import { BadRequestException, HttpException } from '@nestjs/common';

describe('ArticlesService', () => {
  let service: AuthService;
  let userService: UsersService;
  let user: UserEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
      providers: [],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);

    const userEntity = userService.repo.create({
      email: 'test1@test.com',
      password: 'test',
      firstName: 'Test',
      lastName: 'Test',
    });
    user = await userService.repo.save(userEntity);
  });

  afterAll(async () => {
    await userService.repo.delete(user.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('регистрация пользователя', async () => {
    const newUser = await service.register({
      email: 'user@test.com',
      password: 'user',
      firstName: 'New',
      lastName: 'User',
    });
    const registeredUser = await userService.repo.findOne({ where: { id: newUser.id } });
    expect(registeredUser.email).toEqual(newUser.email);
    expect(registeredUser.firstName).toEqual(newUser.firstName);
    expect(registeredUser.lastName).toEqual(newUser.lastName);

    await userService.repo.delete(newUser.id);
  });

  it('регистрация уже существующего пользователя', async () => {
    const newUser = {
      email: 'test1@test.com',
      password: 'test',
      firstName: 'Test',
      lastName: 'Test',
    };
    await expect(service.register(newUser)).rejects.toThrow(BadRequestException);
    await expect(service.register(newUser)).rejects.toThrow('User already exists');
  });

  it('логин', async () => {
    const { accessToken } = await service.login('test1@test.com', 'test');
    expect(accessToken).not.toBeNull();
  });

  it('логин несуществующего пользователя', async () => {
    const email: string = 'undefined@undefined.undefined';
    const password: string = 'password123';

    await expect(service.login(email, password)).rejects.toThrow(HttpException);
    await expect(service.login(email, password)).rejects.toThrow('User not found');
  });
});
