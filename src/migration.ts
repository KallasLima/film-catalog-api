import type { MigrationInterface, QueryRunner } from 'typeorm';
export class InitialMovies1794000000000 implements MigrationInterface {
  name = 'InitialMovies1794000000000';
  async up(q: QueryRunner): Promise<void> {
    await q.query(
      `CREATE TABLE movies (id varchar PRIMARY KEY NOT NULL, title varchar(200) NOT NULL, description varchar(1000) NOT NULL, release_date varchar(10) NOT NULL, length integer NOT NULL CHECK(length > 0 AND length <= 1440), createdAt datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await q.query('CREATE INDEX movies_created ON movies(createdAt,id)');
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE movies');
  }
}
