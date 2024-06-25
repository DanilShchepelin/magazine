import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) readonly repo: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.repo.findOneBy({ id });
  }
}
