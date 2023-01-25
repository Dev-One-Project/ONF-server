import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entites/account.entity';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { UpdateBasicWorkInfoInput } from './dto/updateBasickInfo.input';
import { UpdateFixedLaborDaysInput } from './dto/updateFixedLaborRule.input';
import { UpdateMaximumLaberInput } from './dto/updateMaximumLaborRule.input';
import { WorkInfo } from './entites/workInfo.entity';

@Injectable()
export class WorkInfoService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(WorkInfo)
    private readonly workInfoRepository: Repository<WorkInfo>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Account)
    private readonly accuntRepository: Repository<Account>,
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

  async insertWorkInfo({
    memberId,
    companyId,
    workInfoId,
    appiedFrom,
  }): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: {
        workInfo: true,
      },
    });

    const workInfo = await this.workInfoRepository.findOne({
      where: {
        companyId,
        id: workInfoId,
      },
      relations: {
        members: true,
      },
    });

    await this.memberRepository
      .createQueryBuilder()
      .update(Member)
      .set({ workInfo: { id: workInfo.id } })
      .where('id=:id', { id: member.id })
      .execute();

    await this.memberRepository
      .createQueryBuilder()
      .update(Member)
      .set({ appliedFrom: appiedFrom })
      .where('id=:id', { id: member.id })
      .execute();

    return this.memberRepository.findOne({
      where: { id: memberId },
      relations: { workInfo: true },
    });
  }

  async updateWorkInfoByMember({
    memberId,
    workInfoId,
    companyId, //
  }: {
    memberId: string;
    workInfoId: string;
    companyId: string;
  }) {
    const memberWorkInfo: Member = await this.memberRepository.findOne({
      where: {
        id: memberId, //
        company: { id: companyId },
      },
      relations: ['workInfo', 'company'],
    });

    const newWorkInfo = {
      ...memberWorkInfo,
      id: memberId,
      workInfo: { id: workInfoId },
    };
    await this.memberRepository.save(newWorkInfo);
    return memberWorkInfo;
  }

  async updateWorkInfo({
    workInfoId,
    updateBasicWorkInfoInput,
    updateFixedLaborDaysInput,
    updateMaximumLaberInput,
  }: {
    workInfoId: string;
    updateBasicWorkInfoInput: UpdateBasicWorkInfoInput;
    updateFixedLaborDaysInput: UpdateFixedLaborDaysInput;
    updateMaximumLaberInput: UpdateMaximumLaberInput;
  }): Promise<WorkInfo> {
    const companyWorkInfo: WorkInfo = await this.workInfoRepository.findOne({
      where: { id: workInfoId },
    });

    const newWorkInfo: WorkInfo = {
      ...companyWorkInfo,
      id: workInfoId,
      ...updateBasicWorkInfoInput,
      ...updateFixedLaborDaysInput,
      ...updateMaximumLaberInput,
    };
    return await this.workInfoRepository.save(newWorkInfo);
  }

  async findWorkInfo({ companyId }) {
    const company = await this.companyRepository.find({
      where: { id: companyId },
      relations: {
        workInfo: true,
      },
    });
    return company[0].workInfo;
  }

  async deleteCompanyWorkInfo({ workInfoId }) {
    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.workInfo', 'workInfo')
      .where('workInfo.id = :workInfoId', { workInfoId })
      .getMany();

    members.forEach(async (member) => {
      await this.memberRepository.delete({ id: member.id });
    });

    return await this.workInfoRepository.delete({ id: workInfoId });
  }
}
