import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleTemplate } from './entities/scheduleTemplate.entity';
import { ScheduleTemplateResolver } from './scheduleTemplate.resolver';
import { ScheduleTemplateService } from './scheduleTemplate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleTemplate, //
    ]),
  ],
  providers: [
    ScheduleTemplateResolver, //
    ScheduleTemplateService,
  ],
})
export class ScheduleTemplateModule {}
