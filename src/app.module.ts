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
import { CategoryModule } from './apis/categories/category.module';
import { OrganizationModule } from './apis/organization/organization.module';

@Module({
  imports: [
    AuthModule,
    WorkCheckModule,
    CompanyModule,
    CategoryModule,
    OrganizationModule,
    MemberModule,
    VacationCategoryModule,
    VacationModule,
    AccountModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [
          'http://localhost:3000',
          'https://localhost:3000',
          'http://localhost:4000',
          'https://localhost:4000',
        ],
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
})
export class AppModule {}
