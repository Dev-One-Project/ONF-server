import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { VacationCategory } from '../vacationCategory/entities/vacationCategory.entity';
import { Vacation } from './entities/vacation.entity';
import { VacationResolver } from './vacation.resolver';
import { VacationService } from './vacation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vacation,
      Member, //
      VacationCategory,
      Company,
    ]),
  ],
  providers: [
    VacationResolver, //
    VacationService,
  ],
})
export class VacationModule {}
