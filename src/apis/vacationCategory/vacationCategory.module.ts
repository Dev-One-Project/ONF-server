import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { VacationCategory } from './entities/vacationCategory.entity';
import { VacationCategoryResolver } from './vacationCategory.resolver';
import { VacationCategoryService } from './vacationCategory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VacationCategory, Organization, RoleCategory]),
  ],
  providers: [
    VacationCategoryService, //
    VacationCategoryResolver,
  ],
})
export class VacationCategoryModule {}
