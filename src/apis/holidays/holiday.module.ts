import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../companies/company.service';
import { Company } from '../companies/entities/company.entity';
import { GlobalConfig } from '../globalConfig/entities/globalConfig.entity';
import { Member } from '../members/entities/member.entity';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { Holiday } from './enties/holiday.entity';
import { HolidayResolver } from './holiday.resolver';
import { HolidayService } from './holiday.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Holiday, //
      Company,
      Member,
      RoleCategory,
      Organization,
      GlobalConfig,
    ]),
  ],
  providers: [
    HolidayResolver, //
    HolidayService,
    CompanyService,
  ],
})
export class HolidayModule {}
