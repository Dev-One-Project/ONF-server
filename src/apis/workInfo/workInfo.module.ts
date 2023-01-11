import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/entites/account.entity';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { WorkInfo } from './entites/workInfo.entity';
import { WorkInfoResolver } from './workInfo.resolver';
import { WorkInfoService } from './workInfo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkInfo, //
      Company,
      Member,
      Account,
    ]),
  ],
  providers: [
    WorkInfoResolver, //
    WorkInfoService,
  ],
})
export class WorkInfoModule {}
