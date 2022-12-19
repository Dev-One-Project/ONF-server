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

  private sqlInit =
    this.globalConfigRepository.createQueryBuilder('globalConfig');

  async create({ createGlobalConfigInput }) {
    const { companyId, ...input } = createGlobalConfigInput;
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .where('company.id = :companyId', { companyId })
      .getOne();

    const config = this.globalConfigRepository.create({
      ...input,
      company,
    });
    return this.globalConfigRepository.save(config);
  }

  async update({ updateGlobalConfigInput }) {
    const { companyId, ...input } = updateGlobalConfigInput;
    const config = await this.sqlInit
      .leftJoinAndSelect('globalConfig.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getOne();

    const updateData = {
      ...config,
      ...input,
    };

    return this.globalConfigRepository.save(updateData);
  }

  async fetch({ companyId }) {
    return this.sqlInit
      .leftJoinAndSelect('globalConfig.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getOne();
  }
}
