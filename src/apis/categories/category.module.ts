import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from '../companies/company.service';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { MemberService } from '../members/member.service';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Company, Member])],
  providers: [CategoryResolver, CategoryService, CompanyService, MemberService],
})
export class CategoryModule {}
