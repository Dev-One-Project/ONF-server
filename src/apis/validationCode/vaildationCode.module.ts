import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/entites/account.entity';
import { ValidationCode } from './entities/vaildationCode.entity';
import { ValidationCodeResolver } from './vaildationCode.resolver';
import { ValidationCodeServcie } from './vaildationCode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ValidationCode, //
      Account,
    ]),
  ],
  providers: [
    ValidationCodeResolver, //
    ValidationCodeServcie,
  ],
})
export class ValidationCodeModule {}
