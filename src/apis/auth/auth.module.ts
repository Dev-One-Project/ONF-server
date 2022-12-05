import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/common/auth/jwt-social-google.stragegy';
import { AccountService } from '../accounts/account.service';
import { Account } from '../accounts/entites/account.entity';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      Account, //
    ]),
  ],
  providers: [
    JwtRefreshStrategy, //
    JwtGoogleStrategy,
    AuthResolver,
    AuthService,
    AccountService,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
