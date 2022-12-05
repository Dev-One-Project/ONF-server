import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { CompanyService } from '../companies/company.service';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Company, Member, Category]),
  ],
  providers: [OrganizationResolver, OrganizationService, CompanyService],
})
export class OrganizationModule {}
