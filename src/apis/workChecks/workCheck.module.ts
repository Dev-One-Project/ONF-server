import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
import { WorkCheck } from './entities/workCheck.entity';
import { WorkCheckResolver } from './workCheck.resolver';
import { WorkCheckService } from './workCheck.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkCheck, //
      Member,
    ]),
  ],
  providers: [
    WorkCheckResolver, //
    WorkCheckService,
  ],
})
export class WorkCheckModule {}
