import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entities/category.entity';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Category])],
  providers: [CompanyService, CompanyResolver, CategoryService],
})
export class CompanyModule {}
