import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../companies/company.service';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Company, Member, RoleCategory]),
  ],
  providers: [OrganizationResolver, OrganizationService, CompanyService],
})
export class OrganizationModule {}
