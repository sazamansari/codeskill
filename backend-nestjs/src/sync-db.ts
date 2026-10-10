import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  console.log('Connecting to app module to sync database...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const dataSource = app.get(DataSource);
  console.log('Synchronizing database schema...');
  await dataSource.synchronize();
  console.log('Schema synchronized successfully!');

  await app.close();
  process.exit(0);
}

bootstrap();
