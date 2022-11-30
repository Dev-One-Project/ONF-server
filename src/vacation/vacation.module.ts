import { Module } from '@nestjs/common';
import { vacationResolver } from './vacation.resolver';
import { vacationService } from './vacation.service';

@Module({
  providers: [
    vacationResolver, //
    vacationService,
  ],
})
export class vacationModule {}
