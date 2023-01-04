import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { WorkCheck } from './entities/workCheck.entity';
import { getDatesStartToEnd, getToday } from 'src/common/libraries/utils';
import { minusNineHour } from 'src/common/libraries/utils';
import { Schedule } from '../schedules/entities/schedule.entity';

@Injectable()
export class WorkCheckService {
  constructor(
    @InjectRepository(WorkCheck)
    private readonly workCheckRepository: Repository<WorkCheck>, //

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findMemberWorkCheck({ memberId, startDate, endDate }) {
    endDate.setDate(endDate.getDate() + 1);

    return await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .leftJoinAndSelect('WorkCheck.member', 'member')
      .leftJoinAndSelect('WorkCheck.company', 'company')
      .leftJoinAndSelect('WorkCheck.organization', 'organization')
      .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
      .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
      .where('WorkCheck.member = :memberId', { memberId })
      .andWhere(
        `WorkCheck.workDay BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      )
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
            `WorkCheck.workDay BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
          )
          .orderBy('WorkCheck.workDay', 'DESC')
          .getMany();
      }),
    );

    return result.flat();
  }

  async findMonth({ companyId, organizationId, month }) {
    const monthStartToEnd = getDatesStartToEnd(month);

    const memberInOrg = await this.memberRepository
      .createQueryBuilder('Member')
      .where('Member.isJoin = :isJoin', { isJoin: true })
      .andWhere('Member.company = :companyId', { companyId })
      .andWhere('Member.organization IN (:...organizationId)', {
        organizationId,
      })
      .getMany();

    const result = [];

    await Promise.all(
      memberInOrg.map(async (member) => {
        const workChecks = await this.workCheckRepository
          .createQueryBuilder('WorkCheck')
          .leftJoinAndSelect('WorkCheck.company', 'company')
          .leftJoinAndSelect('WorkCheck.member', 'member')
          .leftJoinAndSelect('WorkCheck.organization', 'organization')
          .leftJoinAndSelect('WorkCheck.schedule', 'schuedule')
          .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
          .where('WorkCheck.workDay IN (:...monthStartToEnd)', {
            monthStartToEnd,
          })
          .andWhere('WorkCheck.member = :memberId', { memberId: member.id })
          .orderBy('WorkCheck.workday', 'ASC')
          .addOrderBy('member.name', 'ASC')
          .getMany();

        const memberWorkCheck = [];

        for (let i = 0; i < monthStartToEnd.length; i++) {
          const workDay = monthStartToEnd[i];

          const workChecksForDay = workChecks.find(
            (workCheck) =>
              workCheck.workDay.toISOString() === workDay.toISOString(),
          );
          memberWorkCheck.push(workChecksForDay ? [workChecksForDay] : []);
        }
        result.push(memberWorkCheck);
      }),
    );

    return result;
  }

  async createAdmin({ companyId, createWorkCheckInput }) {
    const { workingTime, quittingTime } = createWorkCheckInput;

    minusNineHour(workingTime);
    minusNineHour(quittingTime);

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

    const startToday = new Date();
    startToday.setHours(9, 0, 0, 0);
    const copyDate = new Date();
    const endToday = new Date(copyDate.setDate(copyDate.getDate() + 1));
    endToday.setHours(9, 0, 0, 0);

    const schedule = await this.scheduleRepository
      .createQueryBuilder('Schedule')
      .where('Schedule.member = :memberId', { memberId })
      .andWhere(
        `Schedule.date BETWEEN '${startToday.toISOString()}' AND '${endToday.toISOString()}'`,
      )
      .getOne();

    const duplicateWorkCheck = await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .where('WorkCheck.member = :memberId', { memberId })
      .andWhere('WorkCheck.workDay BETWEEN :start AND :end', {
        start: startToday,
        end: endToday,
      })
      .andWhere('WorkCheck.quittingTime IS NULL')
      .getOne();

    if (duplicateWorkCheck) {
      throw new UnprocessableEntityException('이미 출근하셨습니다.');
    }

    const result = await this.workCheckRepository.save({
      member: memberId,
      company: member.company,
      organization: member.organization,
      roleCategory: member.roleCategory,
      workDay: getToday(),
      workingTime: new Date(),
      schedule,
    });

    return result;
  }

  async createEndWork({ workCheckId }) {
    const origin = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    const startToday = new Date();
    startToday.setHours(9, 0, 0, 0);
    const copyDate = new Date();
    const endToday = new Date(copyDate.setDate(copyDate.getDate() + 1));
    endToday.setHours(9, 0, 0, 0);

    const checkWorkCheck = await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .where('WorkCheck.id = :workCheckId', { workCheckId })
      .andWhere(
        `WorkCheck.workDay BETWEEN '${startToday.toISOString()}' AND '${endToday.toISOString()}'`,
      )
      .getOne();

    if (checkWorkCheck.quittingTime) {
      throw new UnprocessableEntityException('이미 퇴근하셨습니다.');
    }
    // 나의 생각 : 하루에 출근기록을 여러번 했는데 퇴근하기를 하려면 여러개기 때문에 workCheckId로는 힘들거 같음 애초에 workCheckId를 받으면 안되고 그냥 context
    // 받아서 해결해야할듯 그리고 테이블하나를 추가해서 is퇴근 같은거 해서 구별해야할듯???

    return await this.workCheckRepository.save({
      ...origin,
      id: workCheckId,
      quittingTime: new Date(),
    });
  }

  async updateOne({ workCheckId, updateWorkCheckInput }) {
    const findWorkCheck = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
      relations: ['member', 'organization', 'schedule', 'roleCategory'],
    });

    // const originArr = Object.entries(findWorkCheck);
    // const updateKey = Object.keys(updateWorkCheckInput);

    // const updateObj = {};

    // await Promise.all(
    //   updateKey.map((a) => {
    //     return originArr.filter((x) => {
    //       if (x[0] === a) {
    //         return (updateObj[a] = updateWorkCheckInput[a]);
    //       }
    //     });
    //   }),
    // );

    // const { workingTime, quittingTime, breakStartTime, breakEndTime } =
    //   updateWorkCheckInput;

    // workingTime?.setHours(workingTime.getHours() - 9);
    // quittingTime?.setHours(quittingTime.getHours() - 9);
    // breakStartTime?.setHours(breakStartTime.getHours() - 9);
    // breakEndTime?.setHours(breakEndTime.getHours() - 9);

    // return await this.workCheckRepository.save({
    //   ...findWorkCheck,
    //   id: workCheckId,
    //   ...updateObj,
    //   organization: updateWorkCheckInput?.organizationId,
    //   roleCategory: updateWorkCheckInput?.roleCategoryId,
    // });
    const { workingTime, quittingTime, isWorking } = updateWorkCheckInput;

    if (isWorking) {
      findWorkCheck.quittingTime = null;
    }

    if (workingTime) {
      workingTime.setHours(workingTime.getHours() - 9);
    }

    if (quittingTime) {
      quittingTime.setHours(quittingTime.getHours() - 9);
    }

    const updateObj = Object.assign({}, findWorkCheck, updateWorkCheckInput);

    console.log(updateObj);

    const { organizationId, roleCategoryId, ...rest } = updateObj;

    return await this.workCheckRepository.save({
      ...findWorkCheck,
      id: workCheckId,
      ...rest,
      organization: organizationId,
      roleCategory: roleCategoryId,
    });
  }

  async updateMany({ workCheckId, updateWorkCheckInput }) {
    const result = await Promise.all(
      workCheckId.map(async (workCheckId) => {
        const origin = await this.workCheckRepository.findOne({
          where: { id: workCheckId },
          relations: {
            schedule: true,
          },
        });

        const updateObj = Object.assign({}, origin, updateWorkCheckInput);

        const { workingTime, quittingTime } = updateWorkCheckInput;

        if (workingTime) {
          workingTime.setHours(workingTime.getHours() - 9);
        }

        if (quittingTime) {
          quittingTime.setHours(quittingTime.getHours() - 9);
        }

        const { organizationId, roleCategoryId, ...rest } = updateObj;

        if (origin.schedule === null) {
          return await this.workCheckRepository.save({
            ...origin,
            id: workCheckId,
            ...rest,
          });
        } else {
          return await this.workCheckRepository.save({
            ...origin,
            id: workCheckId,
            ...rest,
            organization: organizationId,
            roleCategory: roleCategoryId,
          });
        }
      }),
    );
    return result;
  }

  async deleteOne({ workCheckId }) {
    const result = await this.workCheckRepository.delete({
      id: workCheckId,
    });

    return result.affected ? true : false;
  }

  async deleteMany({ workCheckId }) {
    let result = true;
    for await (const id of workCheckId) {
      const deletes = await this.workCheckRepository.delete({ id });

      if (!deletes.affected) result = false;
    }
    return result;
  }
}
