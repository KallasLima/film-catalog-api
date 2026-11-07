import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('movies')
export class Movie {
  @ApiProperty({ format: 'uuid' }) @PrimaryGeneratedColumn('uuid') id!: string;
  @ApiProperty() @Column({ type: 'varchar', length: 200 }) title!: string;
  @ApiProperty() @Column({ type: 'varchar', length: 1000 }) description!: string;
  @ApiProperty({ example: '2020-01-20', format: 'date' })
  @Column({ type: 'varchar', length: 10 })
  release_date!: string;
  @ApiProperty({ minimum: 1, maximum: 1440 }) @Column({ type: 'integer' }) length!: number;
  @ApiProperty() @CreateDateColumn({ type: 'datetime' }) createdAt!: Date;
}
