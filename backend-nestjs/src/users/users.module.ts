import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User as UserEntity } from '../database/entities/user.entity';
import { Problem as ProblemEntity } from '../database/entities/problem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProblemEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
