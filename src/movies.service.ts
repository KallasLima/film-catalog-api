import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity.js';
import { CreateMovieDto, ListMoviesDto, UpdateMovieDto } from './movie.dto.js';
@Injectable()
export class MoviesService {
  constructor(@InjectRepository(Movie) private readonly movies: Repository<Movie>) {}
  async list({ q = '', offset, limit }: ListMoviesDto) {
    const query = this.movies.createQueryBuilder('movie');
    if (q.trim()) query.where('instr(LOWER(movie.title), :q) > 0', { q: q.trim().toLowerCase() });
    const [items, total] = await query
      .orderBy('movie.createdAt', 'DESC')
      .addOrderBy('movie.id', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    return { items, total, offset, limit };
  }
  async get(id: string) {
    const movie = await this.movies.findOneBy({ id });
    if (!movie) throw new NotFoundException('Movie not found.');
    return movie;
  }
  async create(input: CreateMovieDto) {
    return this.movies.save(this.movies.create(input));
  }
  async update(id: string, input: UpdateMovieDto) {
    if (!Object.keys(input).length)
      throw new BadRequestException('At least one field is required.');
    await this.get(id);
    await this.movies.update(id, input);
    return this.get(id);
  }
  async remove(id: string) {
    const result = await this.movies.delete(id);
    if (!result.affected) throw new NotFoundException('Movie not found.');
  }
}
