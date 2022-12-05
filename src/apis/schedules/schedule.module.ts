import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
import { Schedule } from './entities/schedule.entity';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Schedule, //
      Member,
    ]),
  ],
  providers: [
    ScheduleResolver, //
    ScheduleService,
  ],
})
export class ScheduleModule {}
