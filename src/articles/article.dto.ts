import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(40)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: false })
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: false })
  description?: string;
}

export class UpdateArticleDto extends CreateArticleDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  published?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: false })
  slug?: string;
}
