import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { ScheduleTemplate } from './entities/scheduleTemplate.entity';
import { ScheduleTemplateResolver } from './scheduleTemplate.resolver';
import { ScheduleTemplateService } from './scheduleTemplate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleTemplate, //
      Organization,
      RoleCategory,
    ]),
  ],
  providers: [
    ScheduleTemplateResolver, //
    ScheduleTemplateService,
  ],
})
export class ScheduleTemplateModule {}
