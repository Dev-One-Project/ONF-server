import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { WorkCheck } from './entities/workCheck.entity';
import { getDatesStartToEnd, getToday } from 'src/common/libraries/utils';
import { minusNineHour } from 'src/common/libraries/utils';

@Injectable()
export class WorkCheckService {
  constructor(
    @InjectRepository(WorkCheck)
    private readonly workCheckRepository: Repository<WorkCheck>, //

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async findCompanyWorkCheck({ companyId }) {
    return await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .leftJoinAndSelect('WorkCheck.member', 'member')
      .leftJoinAndSelect('WorkCheck.company', 'company')
      .leftJoinAndSelect('WorkCheck.organization', 'organization')
      .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
      .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
      .where('WorkCheck.company = :id', { id: companyId })
      .orderBy('WorkCheck.createdAt', 'DESC')
      .getMany();
  }

  async findMemberWorkCheck({ memberId }) {
    return await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .leftJoinAndSelect('WorkCheck.member', 'member')
      .leftJoinAndSelect('WorkCheck.company', 'company')
      .leftJoinAndSelect('WorkCheck.organization', 'organization')
      .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
      .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
      .where('WorkCheck.member = :id', { id: memberId })
      .orderBy('WorkCheck.createdAt', 'DESC')
      .getMany();
  }

  async findDateMemberWorkCheck({
    companyId,
    organizationId,
    startDate,
    endDate,
  }) {
    endDate.setDate(endDate.getDate() + 1);

    // TODO : 지점ID 없이 검색할때 전체 조회
    const result = await Promise.all(
      organizationId.map(async (organizationId: string) => {
        return await this.workCheckRepository
          .createQueryBuilder('WorkCheck')
          .leftJoinAndSelect('WorkCheck.member', 'member')
          .leftJoinAndSelect('WorkCheck.company', 'company')
          .leftJoinAndSelect('WorkCheck.organization', 'organization')
          .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
          .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
          .where('WorkCheck.company = :companyId', { companyId })
          .andWhere('WorkCheck.organization = :organizationId', {
            organizationId,
          })
          .andWhere(
            `WorkCheck.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
          )
          .orderBy('WorkCheck.createdAt', 'DESC')
          .getMany();
      }),
    );

    return result.flat();
  }

  async findMonth({ companyId, month }) {
    const monthStartToEnd = getDatesStartToEnd(month);
    const result = [];

    await Promise.all(
      monthStartToEnd.map(async (date) => {
        const start = new Date(date);
        const copyDate = new Date(date);
        const end = new Date(copyDate.setDate(copyDate.getDate() + 1));

        const data = await this.workCheckRepository
          .createQueryBuilder('WorkCheck')
          .leftJoinAndSelect('WorkCheck.member', 'member')
          .leftJoinAndSelect('WorkCheck.company', 'company')
          .leftJoinAndSelect('WorkCheck.organization', 'organization')
          .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
          .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
          .where('WorkCheck.company = :companyId', { companyId })
          .andWhere(
            `WorkCheck.WorkDay BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`,
          )
          .orderBy('WorkCheck.WorkDay', 'DESC')
          .getMany();

        data ? result.push(data) : data;
      }),
    );

    return result;
  }

  async createAdmin({ companyId, createWorkCheckInput }) {
    const { workingTime, quittingTime, breakStartTime, breakEndTime } =
      createWorkCheckInput;

    minusNineHour(workingTime);
    minusNineHour(quittingTime);
    minusNineHour(breakStartTime);
    minusNineHour(breakEndTime);

    // 회사ID는 어떻게 넣을까(가드로 해결)
    return await this.workCheckRepository.save({
      ...createWorkCheckInput,
      comapny: companyId,
      member: createWorkCheckInput.memberId,
      schedule: createWorkCheckInput.scheduleId,
      organization: createWorkCheckInput.organizationId,
      roleCategory: createWorkCheckInput.roleCategoryId,
    });
  }

  async createMemo({ workCheckId, workCheckMemo }) {
    const find = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    return await this.workCheckRepository.save({
      ...find,
      workCheckMemo,
    });
  }

  async createStartWork({ memberId }) {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['company', 'roleCategory', 'organization'],
    });

    // 당일에 한번 찍었으면 또 안생기게 검증 로직 써야함

    const result = await this.workCheckRepository.save({
      member: memberId,
      company: member.company,
      organization: member.organization,
      roleCategory: member.roleCategory,
      // schedule 후에 추가
      workDay: getToday(),
      workingTime: new Date(),
    });

    return result;
  }

  async createEndWork({ workCheckId }) {
    const origin = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    return await this.workCheckRepository.save({
      ...origin,
      id: workCheckId,
      quittingTime: new Date(),
    });
  }

  // async createStartBreak({ workCheckId }) {
  //   const origin = await this.workCheckRepository.findOne({
  //     where: { id: workCheckId },
  //   });

  //   // TODO : 츨근 후 근무중인 상태만 누를수있게하기

  //   return await this.workCheckRepository.save({
  //     ...origin,
  //     id: workCheckId,
  //     breakStartTime: new Date(),
  //   });
  // }

  // async createEndBreak({ workCheckId }) {
  //   const origin = await this.workCheckRepository.findOne({
  //     where: { id: workCheckId },
  //   });

  //   return await this.workCheckRepository.save({
  //     ...origin,
  //     id: workCheckId,
  //     breakEndTime: new Date(),
  //   });
  // }

  async update({ workCheckId, updateWorkCheckInput }) {
    const findWorkCheck = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
      relations: ['member', 'organization', 'schedule', 'roleCategory'],
    });

    const originArr = Object.entries(findWorkCheck);
    const updateKey = Object.keys(updateWorkCheckInput);

    const updateObj = {};

    await Promise.all(
      updateKey.map((a) => {
        return originArr.filter((x) => {
          if (x[0] === a) {
            return (updateObj[a] = updateWorkCheckInput[a]);
          }
        });
      }),
    );

    const { workingTime, quittingTime, breakStartTime, breakEndTime } =
      updateWorkCheckInput;

    workingTime?.setHours(workingTime.getHours() - 9);
    quittingTime?.setHours(quittingTime.getHours() - 9);
    breakStartTime?.setHours(breakStartTime.getHours() - 9);
    breakEndTime?.setHours(breakEndTime.getHours() - 9);

    return await this.workCheckRepository.save({
      ...findWorkCheck,
      id: workCheckId,
      ...updateObj,
      organization: updateWorkCheckInput?.organizationId,
      roleCategory: updateWorkCheckInput?.roleCategoryId,
    });
  }

  async delete({ workCheckId }) {
    const result = await this.workCheckRepository.delete({
      id: workCheckId,
    });

    return result.affected ? true : false;
  }
}
