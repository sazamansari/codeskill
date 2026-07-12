import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampusController } from './campus.controller';
import { CampusService } from './campus.service';
import {
  University,
  UniversitySchema,
} from '../database/schemas/university.schema';
import {
  UniversityUser,
  UniversityUserSchema,
} from '../database/schemas/university-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: University.name, schema: UniversitySchema },
      { name: UniversityUser.name, schema: UniversityUserSchema },
    ]),
  ],
  controllers: [CampusController],
  providers: [CampusService],
  exports: [CampusService],
})
export class CampusModule {}
