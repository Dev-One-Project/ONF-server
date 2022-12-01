import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationCategory } from './entities/vacationCategory.entity';
import { VacationCategoryResolver } from './vacationCategory.resolver';
import { VacationCategoryService } from './vacationCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([VacationCategory])],
  providers: [
    VacationCategoryService, //
    VacationCategoryResolver,
  ],
})
export class VacationCategoryModule {}
