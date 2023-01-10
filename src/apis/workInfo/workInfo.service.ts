import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { WorkInfo } from './entites/workInfo.entity';

@Injectable()
export class WorkInfoService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(WorkInfo)
    private readonly workInfoRepository: Repository<WorkInfo>,
  ) {}

  async createWorkInfo({
    companyId,
    createBasicWorkInfoInput,
    createFixedLaborDaysInput,
    createMaximumLaberInput,
  }) {
    const BasicWorkInfoInput: WorkInfo = { ...createBasicWorkInfoInput };
    const FixedLaborDaysInput: WorkInfo = { ...createFixedLaborDaysInput };
    const MaximumLaberInput: WorkInfo = { ...createMaximumLaberInput };

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    return await this.workInfoRepository.save({
      ...BasicWorkInfoInput,
      ...FixedLaborDaysInput,
      ...MaximumLaberInput,
      companyId: company.id,
    });
  }
}
