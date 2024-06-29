import { PageOptionsDto } from '../app/page-options.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  readonly published?: boolean;

  @IsString()
  @IsOptional()
  readonly publishedAt?: string;

  @IsString()
  @IsOptional()
  readonly authorName?: string;
}
