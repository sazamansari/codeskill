import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { User as UserEntity } from './src/database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const repo = app.get(getRepositoryToken(UserEntity));
    const user = await repo.findOne({ where: { uid: '32113211' } });
    if (user) {
      console.log('User found:', user.name, user.uid, user.email);
    } else {
      console.log('User not found in DB with UID 32113211');
    }
    await app.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}
bootstrap();
