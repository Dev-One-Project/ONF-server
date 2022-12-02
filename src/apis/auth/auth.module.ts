import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { AccountService } from '../accounts/account.service';
import { Account } from '../accounts/entites/account.entity';
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
    JwtRefreshStrategy,
    AuthResolver, //
    AuthService,
    AccountService,
  ],
})
export class AuthModule {}
