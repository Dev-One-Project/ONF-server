import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Account } from './entites/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account, //
      Company,
      Member,
    ]),
  ],
  providers: [
    JwtAccessStrategy,
    AccountResolver, //
    AccountService,
  ],
})
export class AccountModule {}
