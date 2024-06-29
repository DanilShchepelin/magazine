import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';
import { UserEntity } from '../users/user.entity';
import { LoginDto } from './login.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  /**
   * Регистрация пользователя.
   *
   * @param user - Данные пользователя для регистрации.
   * @returns Созданный пользователь.
   */
  @Post('register')
  @ApiOperation({
    summary: 'Регистрация пользователя',
  })
  @ApiCreatedResponse({
    description: 'При успешном запросе отображается зарегистрированный пользователь',
  })
  @ApiBody({ type: CreateUserDto })
  register(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.service.register(user);
  }

  /**
   * Аутентификация пользователя.
   *
   * @param input - Логин и пароль пользователя.
   * @returns JWT токен.
   */
  @Post('login')
  @ApiOperation({
    summary: 'Аутентификация пользователя',
  })
  @ApiOkResponse({
    description: 'При успешном запросе отображается JWT токен',
  })
  @ApiBody({ type: LoginDto })
  login(@Body() input: LoginDto): Promise<{ accessToken: string }> {
    return this.service.login(input.email, input.password);
  }
}
