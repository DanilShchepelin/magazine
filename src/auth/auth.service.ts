import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/user.dto';
import { UserEntity } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto): Promise<UserEntity> {
    const existUser: UserEntity | null = await this.userService.repo.findOneBy({
      email: user.email,
    });
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    const model = this.userService.repo.create(user);
    return this.userService.repo.save(model);
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const payload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userService.repo.findOne({
      where: { email },
      select: { id: true, password: true, email: true },
    });
    console.log(user);

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return null;
  }
}
