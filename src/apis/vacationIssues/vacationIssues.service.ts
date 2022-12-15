import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
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

  async findDetailDate({ companyId, baseDate }) {
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
          .andWhere('vacationIssue.startingPoint >= :baseDate', {
            baseDate,
          })
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

  async findDetailDateWithDelete({ companyId, baseDate }) {
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
          .andWhere('vacationIssue.startingPoint >= :baseDate', {
            baseDate,
          })
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

  async findVacationIssueWithDate({ startDate, endDate }) {
    return await this.vacationIssueRepository
      .createQueryBuilder('vacationIssue')
      .leftJoinAndSelect('vacationIssue.member', 'member')
      .leftJoinAndSelect('vacationIssue.company', 'company')
      .leftJoinAndSelect('vacationIssue.organization', 'organization')
      .where('vacationIssue.startingPoint BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('vacationIssue.expirationDate', 'DESC')
      .getMany();
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
