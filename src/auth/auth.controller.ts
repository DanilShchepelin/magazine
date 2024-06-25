import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';
import { UserEntity } from '../users/user.entity';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.service.register(user);
  }

  @Post('login')
  login(@Body() input: LoginDto): Promise<{ access_token: string }> {
    return this.service.login(input.email, input.password);
  }
}
