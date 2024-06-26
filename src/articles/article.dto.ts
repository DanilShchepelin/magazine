import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArticleDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(40)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  description?: string;
}

export class UpdateArticleDto extends CreateArticleDto {
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  slug?: string;
}
