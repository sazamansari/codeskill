import { S3Module } from './s3/s3.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import {
  appConfig,
  databaseConfig,
  redisConfig,
  jwtConfig,
  awsConfig,
  oauthConfig,
  adminConfig,
} from './config';

import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './emails/email.module';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ExecutionModule } from './execution/execution.module';
import { UsersModule } from './users/users.module';
import { ContestsModule } from './contests/contests.module';
import { AdminModule } from './admin/admin.module';
import { CompaniesModule } from './companies/companies.module';
import { CampusModule } from './campus/campus.module';
import { GatewayModule } from './gateway/gateway.module';
import { HealthModule } from './health/health.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        jwtConfig,
        awsConfig,
        oauthConfig,
        adminConfig,
      ],
    }),
    DatabaseModule,
    EmailModule,
    RedisModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    ProblemsModule,
    SubmissionsModule,
    ExecutionModule,
    UsersModule,
    ContestsModule,
    AdminModule,
    CompaniesModule,
    CampusModule,
    GatewayModule,
    HealthModule,
    DiscussionsModule,
    S3Module,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
