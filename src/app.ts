import 'reflect-metadata';
import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Movie } from './movie.entity.js';
import { MoviesController } from './movies.controller.js';
import { MoviesService } from './movies.service.js';
import { InitialMovies1794000000000 } from './migration.js';
export async function createApp(file = process.env.DB_FILE ?? 'data/films.sqlite', logging = true) {
  await mkdir(dirname(resolve(file)), { recursive: true });
  @Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqljs',
        location: resolve(file),
        autoSave: true,
        entities: [Movie],
        migrations: [InitialMovies1794000000000],
        migrationsRun: true,
        synchronize: false,
      }),
      TypeOrmModule.forFeature([Movie]),
    ],
    controllers: [MoviesController],
    providers: [MoviesService],
  })
  class AppModule {}
  const app = await NestFactory.create(AppModule, {
    logger: logging ? ['error', 'warn', 'log'] : false,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  const config = new DocumentBuilder()
    .setTitle('Film Catalog API')
    .setDescription(
      'Local portfolio API. Create a movie, search the collection, change a field and delete a record. Data persists in a local SQLite file. This unauthenticated demo binds to loopback.',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: { persistAuthorization: false },
  });
  app.enableShutdownHooks();
  await app.init();
  return app;
}
