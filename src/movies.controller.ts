import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service.js';
import { CreateMovieDto, ListMoviesDto, UpdateMovieDto, MovieList } from './movie.dto.js';
import { Movie } from './movie.entity.js';
@ApiTags('movies')
@Controller('movies')
@ApiBadRequestResponse({ description: 'Invalid input.' })
export class MoviesController {
  constructor(private readonly movies: MoviesService) {}
  @Get()
  @ApiOkResponse({ type: MovieList })
  @ApiOperation({ summary: 'List and search movies with bounded pagination' })
  list(@Query() q: ListMoviesDto) {
    return this.movies.list(q);
  }
  @Get(':id')
  @ApiOkResponse({ type: Movie })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.movies.get(id);
  }
  @Post() @ApiCreatedResponse({ type: Movie }) create(@Body() input: CreateMovieDto) {
    return this.movies.create(input);
  }
  @Patch(':id')
  @ApiOkResponse({ type: Movie })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() input: UpdateMovieDto,
  ) {
    return this.movies.update(id, input);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.movies.remove(id);
  }
}
