import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GlobalConfig } from './entities/globalConfig.entity';
import { Company } from '../companies/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GlobalConfigService {
  constructor(
    @InjectRepository(GlobalConfig)
    private readonly globalConfigRepository: Repository<GlobalConfig>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create({ createGlobalConfigInput, companyId }) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .where('company.id = :companyId', { companyId })
      .getOne();

    const config = this.globalConfigRepository.create({
      ...createGlobalConfigInput,
      company,
    });
    return this.globalConfigRepository.save(config);
  }

  async update({ updateGlobalConfigInput, companyId }) {
    const config = await this.globalConfigRepository
      .createQueryBuilder('globalConfig')
      .leftJoinAndSelect('globalConfig.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getOne();

    const updateData = {
      ...config,
      ...updateGlobalConfigInput,
    };

    return this.globalConfigRepository.save(updateData);
  }

  async fetch({ companyId }) {
    return this.globalConfigRepository
      .createQueryBuilder('globalConfig')
      .leftJoinAndSelect('globalConfig.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getOne();
  }
}
