import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  patronymic?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
