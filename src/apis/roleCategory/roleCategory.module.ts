import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { RoleCategory } from './entities/roleCategory.entity';
import { RoleCategoryResolver } from './roleCategory.resolver';
import { RoleCategoryService } from './roleCategory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleCategory, //
      Company,
    ]),
  ],
  providers: [
    RoleCategoryResolver, //
    RoleCategoryService,
  ],
})
export class RoleCategoryModule {}
