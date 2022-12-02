import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Account } from './entites/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account, //
    ]),
  ],
  providers: [
    JwtAccessStrategy,
    AccountResolver, //
    AccountService,
  ],
})
export class AccountModule {}
