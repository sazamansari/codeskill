import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User as UserEntity } from './database/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userModel = app.get(getModelToken('User'));
  const userRepository = app.get(getRepositoryToken(UserEntity));

  console.log('Fetching existing users from MongoDB...');
  const mongoUsers = await userModel.find().lean();
  console.log(`Found ${mongoUsers.length} users in MongoDB.`);

  for (const mu of mongoUsers) {
    const exists = await userRepository.findOne({ where: { uid: mu.uid } });
    if (!exists) {
      const pgUser = userRepository.create({
        mongoId: mu._id.toString(),
        name: mu.name,
        email: mu.email,
        uid: mu.uid,
        password: mu.password,
        role: mu.role,
        isAdmin: mu.isAdmin || false,
        isAssessmentStudent: mu.isAssessmentStudent || false,
        forcePasswordChange: mu.forcePasswordChange || false,
        isActive: mu.isActive !== false,
        studentProfile: mu.studentProfile || {},
        authProvider: mu.authProvider || 'local',
      });
      await userRepository.save(pgUser);
      console.log(`Migrated: ${mu.email} (UID: ${mu.uid})`);
    } else {
      console.log(`Already exists in PG: ${mu.email}`);
    }
  }

  console.log('Migration complete.');
  await app.close();
  process.exit(0);
}

bootstrap();
