import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Schedule } from 'src/apis/schedules/entities/schedule.entity';
import { WorkCheck } from './entities/workCheck.entity';
import { WorkCheckResolver } from './workCheck.resolver';
import { WorkCheckService } from './workCheck.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkCheck, //
      Member,
      Organization,
      Schedule,
    ]),
  ],
  providers: [
    WorkCheckResolver, //
    WorkCheckService,
  ],
})
export class WorkCheckModule {}
