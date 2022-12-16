import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './enties/holiday.entity';
import { HolidayResolver } from './holiday.resolver';
import { HolidayService } from './holiday.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Holiday, //
    ]),
  ],
  providers: [
    HolidayResolver, //
    HolidayService,
  ],
})
export class HolidayModule {}
