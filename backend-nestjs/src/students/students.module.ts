import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../emails/email.module';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CredentialEmailProcessor } from './credential-email.processor';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    BullModule.registerQueue({
      name: 'credential-email',
    }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, CredentialEmailProcessor],
  exports: [StudentsService],
})
export class StudentsModule {}

