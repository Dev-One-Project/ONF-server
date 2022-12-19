import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { MemberModule } from './apis/members/member.module';
import { VacationModule } from './apis/vacation/vacation.module';
import { VacationCategoryModule } from './apis/vacationCategory/vacationCategory.module';
import { AccountModule } from './apis/accounts/account.module';
import { CompanyModule } from './apis/companies/company.module';
import { WorkCheckModule } from './apis/workChecks/workCheck.module';
import { AuthModule } from './apis/auth/auth.module';
import { ScheduleModule } from './apis/schedules/schedule.module';
import { OrganizationModule } from './apis/organization/organization.module';
import { AppController } from './app.controller';
import { VacationIssuesModule } from './apis/vacationIssues/vacationIssues.module';
import { InvitationCodeModule } from './apis/invitationCode/invitationCode.module';
import { ScheduleCategoryModule } from './apis/scheduleCategories/scheduleCategory.module';
import { HolidayModule } from './apis/holidays/holiday.module';
import { GlobalConfigModule } from './apis/globalConfig/globalConfig.module';

const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS.split(',');
@Module({
  imports: [
    ScheduleCategoryModule,
    InvitationCodeModule,
    VacationIssuesModule,
    AuthModule,
    WorkCheckModule,
    CompanyModule,
    OrganizationModule,
    MemberModule,
    VacationCategoryModule,
    VacationModule,
    AccountModule,
    ScheduleModule,
    HolidayModule,
    GlobalConfigModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cache: 'bounded',
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: ALLOWED_HOSTS,
        credentials: true,
        exposedHeaders: ['Set-Cookie', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: [
          'Access-Control-Allow-Origin',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
      },
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/apis/**/*.entity.*'],
      logging: true,
      synchronize: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
