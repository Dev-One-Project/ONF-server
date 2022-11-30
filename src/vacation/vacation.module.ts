import { Module } from '@nestjs/common';
import { VacationResolver } from './vacation.resolver';
import { VacationService } from './vacation.service';

@Module({
  providers: [
    VacationResolver, //
    VacationService,
  ],
})
export class VacationModule {}
