import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleCategory } from './entities/scheduleCategory.entity';
import { ScheduleCategoryResolver } from './scheduleCategory.resolver';
import { ScheduleCategoryService } from './scheduleCategory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleCategory, //
    ]),
  ],
  providers: [
    ScheduleCategoryResolver, //
    ScheduleCategoryService,
  ],
})
export class ScheduleCategoryModule {}
