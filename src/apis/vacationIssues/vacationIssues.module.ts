import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { Vacation } from '../vacation/entities/vacation.entity';
import { VacationIssue } from './entities/vacationIssue.entity';
import { VacationIssuesResolver } from './vacationIssues.resolver';
import { VacationIssuesService } from './vacationIssues.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VacationIssue, //
      Member,
      Company,
      Vacation,
    ]),
  ],
  providers: [
    VacationIssuesResolver, //
    VacationIssuesService,
  ],
})
export class VacationIssuesModule {}
