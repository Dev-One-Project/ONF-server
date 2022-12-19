import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfig } from './entities/globalConfig.entity';
import { GlobalConfigResolver } from './globalConfig.resolver';
import { GlobalConfigService } from './globalConfig.service';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalConfig, Company])],
  providers: [GlobalConfigResolver, GlobalConfigService],
})
export class GlobalConfigModule {}
