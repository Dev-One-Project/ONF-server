import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { GlobalConfig } from '../globalConfig/entities/globalConfig.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Member,
      RoleCategory,
      Organization,
      GlobalConfig,
    ]),
  ],
  providers: [CompanyService, CompanyResolver],
})
export class CompanyModule {}
