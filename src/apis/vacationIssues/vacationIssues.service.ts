import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  async findAll() {
    const result = await this.vacationIssueRepository.find({
      relations: ['member', 'company', 'organization'],
    });
    return result;
  }

  async find({ memberId }) {
    const manyVacationId = await this.vacationIssueRepository
      .createQueryBuilder('vacationIssue')
      .leftJoinAndSelect('vacationIssue.member', 'member')
      .leftJoinAndSelect('vacationIssue.company', 'company')
      .leftJoinAndSelect('vacationIssue.organization', 'organization')
      .where('member.id = :member', { member: memberId })
      .getMany();
    return manyVacationId;
  }

  async findOne({ vacationIssueId }) {
    return await this.vacationIssueRepository.findOne({
      where: { id: vacationIssueId },
      relations: ['member', 'company', 'organization'],
    });
  }

  async fetchVacationIssueBaseDate({ companyId, organizationId, baseDate }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository.find({
      where: {
        company: { id: companyId },
      },
      relations: ['company', 'organization'],
    });
    const result = [];
    await Promise.all(
      members.map(async (member) => {
        const vacationUse = await this.vacationRepository
          .createQueryBuilder('vacation')
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .leftJoinAndSelect('vacation.company', 'company')
          .where('member.id = :member', { member: member.id })
          .andWhere('vacation.vacationStartDate <= :baseDate', { baseDate })
          .select(
            'ifnull(SUM(vacationCategory.deductionDays),0)',
            'useVacation',
          )
          .getRawOne();

        const vacationIssues = await this.vacationIssueRepository
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
          .orderBy('vacationIssue.startingPoint', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });

        for (let i = 0; i < vacationIssues.length; i++) {
          vacationIssues[i].expirationDate = baseDate;
          vacationIssues[i].useVacation = vacationUse.useVacation;
          vacationIssues[i].remaining =
            vacationIssues[i].vacationAll - vacationIssues[i].useVacation;
        }

        if (vacationIssues.length > 0) result.push(vacationIssues);
      }),
    );

    return result;
  }

  async fetchVacationIssueWithBaseDateDelete({
    companyId,
    baseDate,
    organizationId,
  }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository.find({
      where: {
        company: { id: companyId },
      },
      withDeleted: true,
      relations: ['company', 'organization'],
    });

    const result = [];
    await Promise.all(
      members.map(async (member) => {
        const useVacationWithDelete = await this.vacationRepository
          .createQueryBuilder('vacation')
          .withDeleted()
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .leftJoinAndSelect('vacation.company', 'company')
          .where('member.id = :member', { member: member.id })
          .andWhere('vacation.vacationStartDate <= :baseDate', { baseDate })
          .select(
            'ifnull(SUM(vacationCategory.deductionDays),0)',
            'useVacation',
          )
          .getRawOne();

        const WithDeleteVacationIssues = await this.vacationIssueRepository
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
          .orderBy('vacationIssue.startingPoint', 'DESC')
          .getMany()
          .then((res) => {
            return res;
          });

        for (let i = 0; i < WithDeleteVacationIssues.length; i++) {
          WithDeleteVacationIssues[i].expirationDate = baseDate;
          WithDeleteVacationIssues[i].useVacation =
            useVacationWithDelete.useVacation;
          WithDeleteVacationIssues[i].remaining =
            WithDeleteVacationIssues[i].vacationAll -
            WithDeleteVacationIssues[i].useVacation;
        }

        if (WithDeleteVacationIssues.length > 0)
          result.push(WithDeleteVacationIssues);
      }),
    );

    return result;
  }

  async findWithDetailDate({ startDate, endDate, companyId, organizationId }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository.find({
      where: {
        company: { id: companyId },
      },
      relations: ['company', 'organization'],
    });

    const result = [];
    await Promise.all(
      members.map(async (member) => {
        const vacationIssues = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :membersId', {
            membersId: member.id,
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
        if (vacationIssues.length > 0) result.push(vacationIssues);
      }),
    );

    return result;
  }
  async findWithDetailDateDelete({
    startDate,
    endDate,
    companyId,
    organizationId,
  }) {
    await this.findWithOrganization({ companyId, organizationId });

    const members = await this.memberRepository.find({
      where: {
        company: { id: companyId },
      },
      withDeleted: true,
      relations: ['company', 'organization'],
    });

    const result = [];
    await Promise.all(
      members.map(async (member) => {
        const WithDeleteVacationIssue = await this.vacationIssueRepository
          .createQueryBuilder('vacationIssue')
          .withDeleted()
          .leftJoinAndSelect('vacationIssue.member', 'member')
          .leftJoinAndSelect('vacationIssue.company', 'company')
          .leftJoinAndSelect('vacationIssue.organization', 'organization')
          .where('member.id = :membersId', {
            membersId: member.id,
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
        if (WithDeleteVacationIssue.length > 0)
          result.push(WithDeleteVacationIssue);
      }),
    );

    return result;
  }

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
    return result.flat();
  }

  async create({ createVacationIssueInput }) {
    console.log(createVacationIssueInput.memberId);
    const member = await this.memberRepository.findOne({
      where: { id: createVacationIssueInput.memberId },
      relations: ['organization', 'company'],
    });

    const result = await this.vacationIssueRepository.save({
      ...createVacationIssueInput,
      member: member,
      organization: member.organization,
      company: member.company,
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

  async updateMany({ vacationIssueId, updateVacationIssueInput }) {
    const leave = await Promise.all(
      vacationIssueId.map(async (vacationIssueId: string) => {
        const findVacationIssue = await this.findOne({
          vacationIssueId,
        });
        if (!vacationIssueId) {
          throw new UnprocessableEntityException(
            '존재하지 않은 아이디 입니다.',
          );
        }
        if (!updateVacationIssueInput) {
          throw new UnprocessableEntityException(
            '선택사항을 모두 체크하지 않았습니다.',
          );
        }
        const result = await this.vacationIssueRepository.save({
          ...findVacationIssue,
          id: vacationIssueId,
          ...updateVacationIssueInput,
        });

        return result;
      }),
    );
    return leave;
  }

  async delete({ vacationIssueId }) {
    const result = await this.vacationIssueRepository.delete({
      id: vacationIssueId,
    });
    return result.affected ? true : false;
  }

  async deleteMany({ vacationIssueId }) {
    let result = true;
    for await (const id of vacationIssueId) {
      const deletes = await this.vacationIssueRepository.delete({ id });

      if (!deletes.affected) result = false;
    }
    return result;
  }
}
