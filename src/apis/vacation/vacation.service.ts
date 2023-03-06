import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { VacationCategory } from '../vacationCategory/entities/vacationCategory.entity';
import { VacationIssue } from '../vacationIssues/entities/vacationIssue.entity';

import { Vacation } from './entities/vacation.entity';

@Injectable()
export class VacationService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(VacationCategory)
    private readonly vacationCategoryRepository: Repository<VacationCategory>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(VacationIssue)
    private readonly vacationIssueRepository: Repository<VacationIssue>,
  ) {}

  async findAll() {
    return await this.vacationRepository.find({
      relations: ['member', 'company', 'vacationCategory'],
    });
  }

  async findOne({ vacationId }) {
    return this.vacationRepository.findOne({
      where: { id: vacationId },
      relations: ['member', 'company', 'vacationCategory'],
    });
  }

  async findVacationWithData({
    startDate,
    endDate,
    companyId,
    organizationId,
  }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.company', 'company')
      .leftJoinAndSelect('member.organization', 'organization')
      .where('company.id = :companyId', { companyId })
      .getMany();

    const memberArr = await Promise.all(members);

    const result = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const temp = await this.vacationRepository
          .createQueryBuilder('vacation')
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.company', 'company')
          .leftJoinAndSelect('vacation.organization', 'organization')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .where('member.id = :memberId', { memberId: member.id })
          .andWhere(
            'vacation.vacationStartDate BETWEEN :startDate AND :endDate',
            { startDate, endDate },
          )
          .orderBy('vacation.vacationStartDate', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });
        if (temp.length > 0) result.push(temp);
      }),
    );
    return result;
  }

  async findWithOrganization({ companyId, organizationId }) {
    const result = await Promise.all(
      organizationId.map(async (organizationId: string) => {
        return await this.vacationRepository
          .createQueryBuilder('vacationIssue')
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('company.id = :companyId', { companyId })
          .andWhere('organization.id = :organizationId', { organizationId })
          .getMany();
      }),
    );
    return result.flat();
  }
  async findVacationWithDataDelete({
    startDate,
    endDate,
    companyId,
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
        const temp = await this.vacationRepository
          .createQueryBuilder('vacation')
          .withDeleted()
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.company', 'company')
          .leftJoinAndSelect('vacation.organization', 'organization')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .where('member.id = :memberId', { memberId: member.id })
          .andWhere(
            'vacation.vacationStartDate BETWEEN :startDate AND :endDate',
            { startDate, endDate },
          )
          .orderBy('vacation.vacationStartDate', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });
        if (temp.length > 0) result.push(temp);
      }),
    );
    return result;
  }

  async create({ createVacationInput }) {
    // 1. 직원 조회하기
    const answer = await Promise.all(
      createVacationInput.memberId.map(async (member: string) => {
        const members = await this.memberRepository.findOne({
          where: { id: member },
          relations: ['company', 'organization'],
        });
        if (!members) {
          throw new UnprocessableEntityException(
            '해당 직원을 찾을 수 없습니다.',
          );
        }

        // 1. 휴가 생성 시 category를 조회
        const category = await this.vacationCategoryRepository.findOne({
          where: { id: createVacationInput.vacationCategoryId },
        });
        const leave = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :member', { member: members.id })
          .getOne();
        // 2. 휴가 생성할 경우 멤버의 잔여휴가를 차감 한다.
        if (!leave) {
          throw new UnprocessableEntityException(
            '휴가 발생이 없는 멤버입니다. 휴가 발생 후 다시 이용해주세요',
          );
        }
        const result = await Promise.all(
          await createVacationInput.vacations.map(async (date: Date) => {
            leave.useVacation =
              Number(leave.useVacation) + Number(category.deductionDays);

            leave.remaining = leave.vacationAll - leave.useVacation;
            const vacation = this.vacationRepository.create({
              vacationEndDate: date,
              vacationStartDate: date,
              description: createVacationInput.description,
              member: members,
              company: members.company,
              vacationCategory: category,
              organization: members.organization,
            });

            await this.vacationIssueRepository.save(leave);
            await this.vacationRepository.save(vacation);
            return vacation;
          }),
        );

        return result;
      }),
    );

    return answer.flat();
  }

  async update({ vacationId, updateVacationInput }) {
    const member = await this.memberRepository.findOne({
      where: { id: updateVacationInput.memberId },
      relations: ['company'],
    });

    const leave = await this.vacationRepository.findOne({
      where: { id: vacationId },
      relations: ['member', 'company', 'vacationCategory'],
    });

    const category = await this.vacationCategoryRepository.findOne({
      where: { id: updateVacationInput.vacationCategoryId },
    });

    const isExist = await this.vacationRepository
      .createQueryBuilder('vacation')
      .leftJoinAndSelect('vacation.member', 'member')
      .leftJoinAndSelect('vacation.company', 'company')
      .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
      .where('vacation.vacationStartDate <= :date1', {
        date1: updateVacationInput.vacationStartDate,
      })
      .andWhere('vacation.vacationEndDate >= :date2', {
        date2: updateVacationInput.vacationStartDate,
      })
      .andWhere('member.id = :memberId', { memberId: member.id })
      .getOne();

    if (isExist) {
      throw new UnprocessableEntityException(
        '설정하신 날짜는 이미 기간 내에 포함되어 있습니다.',
      );
    }
    const issue = await this.vacationIssueRepository
      .createQueryBuilder('vacationIssue')
      .leftJoinAndSelect('vacationIssue.member', 'member')
      .leftJoinAndSelect('vacationIssue.company', 'company')
      .leftJoinAndSelect('vacationIssue.organization', 'organization')
      .where('member.id = :member', { member: member.id })
      .getOne();

    if (leave.vacationCategory.deductionDays > category.deductionDays) {
      issue.useVacation =
        issue.useVacation -
        leave.vacationCategory.deductionDays -
        category.deductionDays;
      issue.remaining = issue.vacationAll - issue.useVacation;
    } else if (leave.vacationCategory.deductionDays < category.deductionDays) {
      issue.useVacation =
        issue.useVacation +
        category.deductionDays -
        leave.vacationCategory.deductionDays;

      issue.remaining = issue.vacationAll - issue.useVacation;
    }
    const result = await this.vacationRepository.save({
      ...leave,
      description: updateVacationInput.description,
      vacationStartDate: updateVacationInput.vacationStartDate,
      vacationEndDate: updateVacationInput.vacationEndDate,
      vacationCategory: category,
    });

    await this.vacationIssueRepository.save({
      ...issue,
      useVacation: issue.useVacation,
      remaining: issue.remaining,
    });
    console.log(result);
    return result;
  }

  async UpdateManyVacation({ vacationId, updateVacationInput }) {
    const vacations = await Promise.all(
      vacationId.map(async (vacationId: string) => {
        const findVacation = await this.findOne({ vacationId });

        if (!findVacation) {
          throw new UnprocessableEntityException('존재하지 않은 휴가입니다.');
        }

        const category = await this.vacationCategoryRepository.findOne({
          where: { id: updateVacationInput.vacationCategoryId },
        });
        console.log(category);
        if (!category) {
          throw new UnprocessableEntityException('선택사항을 수정해주세요.');
        }
        const issue = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :member', {
            member: findVacation.member.id,
          })
          .getOne();

        if (
          findVacation.vacationCategory.deductionDays > category.deductionDays
        ) {
          issue.useVacation =
            issue.useVacation -
            findVacation.vacationCategory.deductionDays -
            category.deductionDays;
          issue.remaining = issue.vacationAll - issue.useVacation;
        } else if (
          findVacation.vacationCategory.deductionDays < category.deductionDays
        ) {
          issue.useVacation =
            issue.useVacation +
            category.deductionDays -
            findVacation.vacationCategory.deductionDays;

          issue.remaining = issue.vacationAll - issue.useVacation;
        }
        const result = await this.vacationRepository.save({
          ...findVacation,
          id: vacationId,
          vacationCategory: category,
        });
        await this.vacationIssueRepository.save({
          ...issue,
          useVacation: issue.useVacation,
          remaining: issue.remaining,
        });

        return result;
      }),
    );
    return vacations;
  }

  async softdelete({ vacationId }) {
    const result = await this.vacationRepository.softDelete({
      id: vacationId,
    });
    return result.affected ? true : false;
  }

  async delete({ vacationId }) {
    const vacation = await this.vacationRepository.findOne({
      where: { id: vacationId },
      relations: ['member', 'organization', 'vacationCategory'],
    });

    const issue = await this.vacationIssueRepository
      .createQueryBuilder('vacationIssue')
      .leftJoinAndSelect('vacationIssue.company', 'company')
      .leftJoinAndSelect('vacationIssue.member', 'member')
      .leftJoinAndSelect('vacationIssue.organization', 'organization')
      .where('member.id = :member', { member: vacation.member.id })
      .getOne();

    issue.useVacation =
      Number(issue.useVacation) -
      Number(vacation.vacationCategory.deductionDays);
    issue.remaining = issue.vacationAll - issue.useVacation;

    await this.vacationIssueRepository.save({
      ...issue,
      useVacation: issue.useVacation,
      remaining: issue.remaining,
    });
    const result = await this.vacationRepository.delete({
      id: vacationId,
    });
    return result.affected ? true : false;
  }

  async deleteMany({ vacationId }) {
    let result = true;
    for await (const id of vacationId) {
      const vacation = await this.vacationRepository.findOne({
        where: { id },
        relations: ['member', 'organization', 'vacationCategory'],
      });
      const issue = await this.vacationIssueRepository
        .createQueryBuilder('vacationIssue')
        .leftJoinAndSelect('vacationIssue.company', 'company')
        .leftJoinAndSelect('vacationIssue.member', 'member')
        .leftJoinAndSelect('vacationIssue.organization', 'organization')
        .where('member.id = :member', { member: vacation.member.id })
        .getOne();

      if (issue) {
        issue.useVacation =
          issue.useVacation - vacation.vacationCategory.deductionDays;
        issue.remaining = issue.vacationAll - issue.useVacation;

        await this.vacationIssueRepository.save({
          ...issue,
          useVacation: issue.useVacation,
          remaining: issue.remaining,
        });
      } else {
        throw new UnprocessableEntityException(
          '휴가 발생건이 없습니다. 확인하고 다시 실행해주세요',
        );
      }

      const deletes = await this.vacationRepository.delete({ id });

      if (!deletes.affected) result = false;
    }
    return result;
  }
}
