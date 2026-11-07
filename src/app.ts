import 'reflect-metadata';
import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { fileURLToPath } from 'node:url';
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
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: logging ? ['error', 'warn', 'log'] : false,
  });
  // Compiled entry points live under dist/src; presentation files remain in public/.
  app.useStaticAssets(fileURLToPath(new URL('../../public/', import.meta.url)), {
    prefix: '/presentation/',
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  const config = new DocumentBuilder()
    .setTitle('Film Catalog API')
    .setDescription(
      'A local collection. A documented contract. Create, search and update films in a local SQLite database. This unauthenticated demo listens on loopback.',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: { persistAuthorization: false },
    customSiteTitle: 'Film / API · Console',
    customCssUrl: '/presentation/film.css',
    customJs: '/presentation/film.js',
  });
  app.enableShutdownHooks();
  await app.init();
  return app;
}
