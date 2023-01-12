import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entites/account.entity';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
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

  async insertWorkInfo({ email, companyId, name }) {
    const user = await this.accuntRepository.find({
      where: {
        email: email,
      },
      relations: {
        member: true,
        company: true,
      },
    });

    const member = await this.memberRepository.find({
      where: { id: user[0].member.id },
      relations: {
        workInfo: true,
      },
    });

    const workInfo = await this.workInfoRepository.find({
      where: {
        company: { id: companyId },
        name: name,
      },
    });

    await this.memberRepository
      .createQueryBuilder()
      .update(Member)
      .set({ workInfo: { id: workInfo[0].id } })
      .where('id=:id', { id: member[0].id })
      .execute();

    await this.workInfoRepository
      .createQueryBuilder()
      .update(WorkInfo)
      .set({ member: { id: member[0].id } })
      .where('id=:id', { id: workInfo[0].id })
      .execute();

    const result = await this.workInfoRepository.find({
      where: {
        company: { id: companyId },
        name: name,
      },
      relations: {
        member: true,
        company: true,
      },
    });
    return result[0];
  }

  async updateWorkInfo({
    memberId,
    updateBasicWorkInfoInput,
    updateFixedLaborDaysInput,
    updateMaximumLaberInput,
  }) {
    await this.workInfoRepository
      .createQueryBuilder('WorkInfo')
      .innerJoinAndSelect('WorkInfo.member', 'member')
      .update(WorkInfo)
      .set({
        ...updateBasicWorkInfoInput,
        ...updateFixedLaborDaysInput,
        ...updateMaximumLaberInput,
      })
      .where('member.id = :id', { id: memberId })
      .execute();

    const result = await this.workInfoRepository.find({
      where: { member: { id: memberId } },
      relations: { member: true },
    });
    return result[0];
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

    console.log(members);

    members.forEach(async (member) => {
      await this.memberRepository.delete({ id: member.id });
    });

    return await this.workInfoRepository.delete({ id: workInfoId });
  }
}
