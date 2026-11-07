import { Movie } from './movie.entity.js';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsInt,
  Min,
  Max,
  Matches,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
export class CreateMovieDto {
  @ApiProperty({ example: 'A Quiet Orbit', maxLength: 200 })
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;
  @ApiProperty({ example: 'A fictional crew finds a new way home.', maxLength: 1000 })
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description!: string;
  @ApiProperty({ example: '2024-06-10', format: 'date' })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
  @IsDateString({ strict: true })
  release_date!: string;
  @ApiProperty({ example: 105, minimum: 1, maximum: 1440 })
  @IsInt()
  @Min(1)
  @Max(1440)
  length!: number;
}
export class UpdateMovieDto extends PartialType(CreateMovieDto, { skipNullProperties: false }) {}
export class ListMoviesDto {
  @ApiPropertyOptional({ maxLength: 100 }) @IsOptional() @IsString() @MaxLength(100) q?: string;
  @ApiPropertyOptional({ default: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;
  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export class MovieList {
  @ApiProperty({ type: [Movie] }) items!: Movie[];
  @ApiProperty() total!: number;
  @ApiProperty() offset!: number;
  @ApiProperty() limit!: number;
}
