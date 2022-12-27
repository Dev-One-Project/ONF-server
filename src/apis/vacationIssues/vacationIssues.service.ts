import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { Vacation } from '../vacation/entities/vacation.entity';
import { VacationIssue } from './entities/vacationIssue.entity';

@Injectable()
export class VacationIssuesService {
  constructor(
    @InjectRepository(VacationIssue)
    private readonly vacationIssueRepository: Repository<VacationIssue>,
    //
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
  ) {}

  async findAll({ companyId }) {
    await this.companyRepository.findOne({
      where: { id: companyId },
    });
    return this.vacationIssueRepository.find({
      relations: ['member', 'company', 'organization'],
    });
  }

  async findOne({ vacationIssueId }) {
    return await this.vacationIssueRepository.findOne({
      where: { id: vacationIssueId },
      relations: ['member'],
    });
  }

  async fetchVacationIssueBaseDate({
    startDate,
    endDate,
    companyId,
    organizationId,
    baseDate,
  }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();

    const memberArr = await Promise.all(members);
    const result = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const temp = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :membersId', {
            membersId: member.id,
          })
          .andWhere('vacationIssue.startingPoint <= :baseDate', {
            baseDate,
          })
          .andWhere(
            'vacationIssue.startingPoint BETWEEN :startDate AND :endDate',
            {
              startDate,
              endDate,
            },
          )
          .orderBy('vacationIssue.startingPoint', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });
        for (let i = 0; i < temp.length; i++) {
          temp[i].expirationDate = baseDate;
        }
        if (temp.length > 0) result.push(temp);
      }),
    );
    return result;
  }

  async fetchVacationIssueWithBaseDateDelete({
    startDate,
    endDate,
    companyId,
    baseDate,
    organizationId,
  }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository
      .createQueryBuilder('member')
      .withDeleted()
      .leftJoinAndSelect('member.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();

    const memberArr = await Promise.all(members);
    const result = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const temp = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .withDeleted()
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :membersId', {
            membersId: member.id,
          })
          .andWhere('vacationIssue.startingPoint <= :baseDate', {
            baseDate,
          })
          .andWhere(
            'vacationIssue.startingPoint BETWEEN :startDate AND :endDate',
            {
              startDate,
              endDate,
            },
          )
          .orderBy('vacationIssue.startingPoint', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });
        for (let i = 0; i < temp.length; i++) {
          temp[i].expirationDate = baseDate;
        }
        if (temp.length > 0) result.push(temp);
      }),
    );
    return result;
  }

  async findWithDetailDate({
    startDate,
    endDate,
    companyId,
    baseDate,
    organizationId,
  }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();

    const memberArr = await Promise.all(members);
    const result = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const temp = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :membersId', {
            membersId: member.id,
          })
          .andWhere('vacationIssue.startingPoint <= :baseDate', {
            baseDate,
          })
          .andWhere(
            'vacationIssue.startingPoint BETWEEN :startDate AND :endDate',
            {
              startDate,
              endDate,
            },
          )
          .orderBy('vacationIssue.startingPoint', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });
        if (temp.length > 0) result.push(temp);
      }),
    );
    return result;
  }
  async findWithDetailDateDelete({
    startDate,
    endDate,
    companyId,
    baseDate,
    organizationId,
  }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository
      .createQueryBuilder('member')
      .withDeleted()
      .leftJoinAndSelect('member.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();
    const memberArr = await Promise.all(members);
    const result = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const temp = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .withDeleted()
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :membersId', {
            membersId: member.id,
          })
          .andWhere('vacationIssue.startingPoint <= :baseDate', {
            baseDate,
          })
          .andWhere(
            'vacationIssue.startingPoint BETWEEN :startDate AND :endDate',
            {
              startDate,
              endDate,
            },
          )
          .orderBy('vacationIssue.startingPoint', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });
        if (temp.length > 0) result.push(temp);
      }),
    );
    return result;
  }

  async findVacationIssueWithDelete() {
    return await this.vacationIssueRepository.find({
      relations: ['member'],
      withDeleted: true,
    });
  }

  // async findVacationIssueWithDate({ startDate, endDate }) {
  //   return await this.vacationIssueRepository
  //     .createQueryBuilder('vacationIssue')
  //     .leftJoinAndSelect('vacationIssue.member', 'member')
  //     .leftJoinAndSelect('vacationIssue.company', 'company')
  //     .leftJoinAndSelect('vacationIssue.organization', 'organization')
  //     .where('vacationIssue.startingPoint BETWEEN :startDate AND :endDate', {
  //       startDate,
  //       endDate,
  //     })
  //     .orderBy('vacationIssue.expirationDate', 'DESC')
  //     .getMany();
  // }

  async findWithOrganization({ companyId, organizationId }) {
    const result = await Promise.all(
      organizationId.map(async (organizationId: string) => {
        return await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('company.id = :companyId', { companyId })
          .andWhere('organization.id = :organizationId', { organizationId })
          .getMany();
      }),
    );
    console.log(result);
    return result.flat();
  }

  async findUseVacation({ memberId }) {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['company', 'organization'],
    });
    // 1. vacation에서 사용한 휴가를 조회한다.
    // 2. vacationIssue에 있는 vacationAll - 1문항을 하여 remaining에 넣기
    const result = this.vacationRepository
      .createQueryBuilder('vacation')
      .leftJoinAndSelect('vacation.member', 'member')
      .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
      .select('SUM(vacationCategory.deductionDays)', 'useVacation')
      .where('member.id = :member', { member })
      .getRawOne();

    return result;
  }

  async create({ createVacationIssueInput }) {
    const member = await this.memberRepository.findOne({
      where: { id: createVacationIssueInput.memberId },
    });
    const result = await this.vacationIssueRepository.save({
      member,
      ...createVacationIssueInput,
    });
    return result;
  }

  async update({ vacationIssueId, updateVacationIssueInput }) {
    const vacationIssue = await this.vacationIssueRepository.findOne({
      where: { id: vacationIssueId },
      relations: ['member'],
    });
    const result = await this.vacationIssueRepository.save({
      ...vacationIssue,
      id: vacationIssueId,
      ...updateVacationIssueInput,
    });
    return result;
  }

  async delete({ vacationIssueId }) {
    const result = await this.vacationIssueRepository.delete({
      id: vacationIssueId,
    });
    return result.affected ? true : false;
  }
}
