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
      relations: ['member', 'company', 'organization'],
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

    const answer = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const Use = await this.vacationRepository
          .createQueryBuilder('vacation')
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .leftJoinAndSelect('vacation.company', 'company')
          .where('member.id = :member', { member: member.id })
          .andWhere('vacation.vacationStartDate <= :baseDate', { baseDate })
          .select('SUM(vacationCategory.deductionDays)', 'useVacation')
          .addSelect('member.id', 'member')
          .getRawMany();
        console.log(Use);
        for (let i = 0; i < Use.flat().length; i++) {
          if (Use.flat()[i].member !== null || Use.flat()[i].length > 0) {
            answer.push(Use.flat()[i]);
          }
        }
      }),
    );

    const result = [];
    await Promise.all(
      memberArr.map(async (member) => {
        if (!startDate && !endDate) {
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
            .orderBy('vacationIssue.startingPoint', 'DESC')
            .getMany()
            .then((res) => {
              return res;
            });
          for (let i = 0; i < temp.length; i++) {
            temp[i].expirationDate = baseDate;
          }
          if (temp.length > 0) result.push(temp);
        } else {
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
        }
      }),
    );
    for (let i = 0; i < result.flat().length; i++) {
      if (result.flat()[i].member.id === answer.flat()[i].member) {
        result.flat()[i].useVacation = answer.flat()[i].useVacation;
        result.flat()[i].remaining =
          result.flat()[i].vacationAll - result.flat()[i].useVacation;
      }
    }
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

    const answer = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const Use = await this.vacationRepository
          .createQueryBuilder('vacation')
          .withDeleted()
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .leftJoinAndSelect('vacation.company', 'company')
          .where('member.id = :member', { member: member.id })
          .andWhere('vacation.vacationStartDate <= :baseDate', { baseDate })
          .select('SUM(vacationCategory.deductionDays)', 'useVacation')
          .addSelect('member.id', 'member')
          .getRawMany();
        console.log(Use);
        for (let i = 0; i < Use.flat().length; i++) {
          if (Use.flat()[i].member !== null || Use.flat()[i].length > 0) {
            answer.push(Use.flat()[i]);
          }
        }
      }),
    );
    const result = [];
    await Promise.all(
      memberArr.map(async (member) => {
        if (!startDate && !endDate) {
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
            .orderBy('vacationIssue.startingPoint', 'DESC')
            .getMany()
            .then((res) => {
              return res;
            });
          for (let i = 0; i < temp.length; i++) {
            temp[i].expirationDate = baseDate;
          }
          if (temp.length > 0) result.push(temp);
        } else {
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
        }
      }),
    );
    for (let i = 0; i < result.flat().length; i++) {
      if (result.flat()[i].member.id === answer.flat()[i].member) {
        result.flat()[i].useVacation = answer.flat()[i].useVacation;
        result.flat()[i].remaining =
          result.flat()[i].vacationAll - result.flat()[i].useVacation;
      }
    }
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

    const answer = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const Use = await this.vacationRepository
          .createQueryBuilder('vacation')
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .leftJoinAndSelect('vacation.company', 'company')
          .where('member.id = :member', { member: member.id })
          .select('SUM(vacationCategory.deductionDays)', 'useVacation')
          .addSelect('member.id', 'member')
          .getRawMany();

        for (let i = 0; i < Use.flat().length; i++) {
          if (Use.flat()[i].member !== null || Use.flat()[i].length > 0) {
            answer.push(Use.flat()[i]);
          }
        }
      }),
    );

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
    for (let i = 0; i < result.flat().length; i++) {
      console.log(result.flat().length);
      if (result.flat()[i].member.id === answer.flat()[i].member) {
        result.flat()[i].useVacation = answer.flat()[i].useVacation;
        result.flat()[i].remaining =
          result.flat()[i].vacationAll - result.flat()[i].useVacation;
      }
    }
    // console.log(result.flat());
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

    const answer = [];
    await Promise.all(
      memberArr.map(async (member) => {
        const Use = await this.vacationRepository
          .createQueryBuilder('vacation')
          .withDeleted()
          .leftJoinAndSelect('vacation.member', 'member')
          .leftJoinAndSelect('vacation.vacationCategory', 'vacationCategory')
          .leftJoinAndSelect('vacation.company', 'company')
          .where('member.id = :member', { member: member.id })
          .select('SUM(vacationCategory.deductionDays)', 'useVacation')
          .addSelect('member.id', 'member')
          .getRawMany();

        for (let i = 0; i < Use.flat().length; i++) {
          if (Use.flat()[i].member !== null || Use.flat()[i].length > 0) {
            answer.push(Use.flat()[i]);
          }
        }
      }),
    );
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
    for (let i = 0; i < result.flat().length; i++) {
      console.log(result.flat().length);
      if (result.flat()[i].member.id === answer.flat()[i].member) {
        result.flat()[i].useVacation = answer.flat()[i].useVacation;
        result.flat()[i].remaining =
          result.flat()[i].vacationAll - result.flat()[i].useVacation;
      }
    }
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
    return result.flat();
  }

  // async findUseVacation({ memberId }) {
  // //   const member = await this.memberRepository.findOne({
  // //     where: { id: memberId },
  // //     relations: ['company', 'organization'],
  // //   });
  // //   // 1. vacation에서 사용한 휴가를 조회한다.
  // //   // 2. vacationIssue에 있는 vacationAll - 1문항을 하여 remaining에 넣기

  // //   return result;
  // // }

  async create({ createVacationIssueInput }) {
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
