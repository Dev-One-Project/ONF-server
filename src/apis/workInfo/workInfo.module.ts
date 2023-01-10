import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { WorkInfo } from './entites/workInfo.entity';
import { WorkInfoResolver } from './workInfo.resolver';
import { WorkInfoService } from './workInfo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkInfo, //
      Company,
    ]),
  ],
  providers: [
    WorkInfoResolver, //
    WorkInfoService,
  ],
})
export class WorkInfoModule {}
