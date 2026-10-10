import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: '../.env.ec2' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgres://localhost:5432/codeskill',
  synchronize: false,
  logging: true,
  entities: [join(__dirname, 'src/database/entities/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/database/migrations/**/*{.ts,.js}')],
});
