import { Module } from '@nestjs/common';
import { VacationCategoryService } from './vacationCategory.resolver';
import { VacationCategoryResolver } from './vacationCategory.service';

@Module({
  providers: [
    VacationCategoryService, //
    VacationCategoryResolver,
  ],
})
export class VacationCategoryModule {}
