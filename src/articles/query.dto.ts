import { PageOptionsDto } from '../app/page-options.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  readonly published?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly publishedAt?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly authorName?: string;
}
