import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { WorkCheck } from './entities/workCheck.entity';
import {
  changeTime,
  getDatesStartToEnd,
  getToday,
  plusNineHour,
  timeArr,
  timeRange,
} from 'src/common/libraries/utils';
import { minusNineHour } from 'src/common/libraries/utils';
import { Schedule } from 'src/apis/schedules/entities/schedule.entity';
import { Vacation } from '../vacation/entities/vacation.entity';

@Injectable()
export class WorkCheckService {
  constructor(
    @InjectRepository(WorkCheck)
    private readonly workCheckRepository: Repository<WorkCheck>, //

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
  ) {}

  async findOne({ date, memberId, companyId }) {
    // const copyDate = new Date(date);
    // const endDate = new Date(copyDate);
    // endDate.setDate(endDate.getDate() + 1);

    // return await this.workCheckRepository
    //   .createQueryBuilder('WorkCheck')
    //   .leftJoinAndSelect('WorkCheck.company', 'company')
    //   .leftJoinAndSelect('WorkCheck.organization', 'organization')
    //   .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
    //   .leftJoinAndSelect('WorkCheck.member', 'member')
    //   .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
    //   .where('WorkCheck.company = :companyId', { companyId })
    //   .andWhere('WorkCehck.member = :memberId', { memberId })
    //   .andWhere(
    //     `WorkCheck.workDay BETWEEN '${date.toISOString()}' AND '${endDate.toISOString()}'`,
    //   )
    //   .getOne();
    const startDate = new Date(date);
    startDate.setHours(9, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(9, 0, 0, 0);

    return await this.workCheckRepository.findOne({
      where: {
        company: { id: companyId },
        member: { id: memberId },
        workDay: Between(startDate, endDate),
      },
      relations: [
        'company',
        'organization',
        'roleCategory',
        'member',
        'schedule',
      ],
    });
  }

  async checkStatus({ memberId }) {
    const result = await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .leftJoinAndSelect('WorkCheck.member', 'member')
      .where('member.id = :memberId', { memberId })
      .andWhere('WorkCheck.workingTime IS NOT NULL')
      .andWhere('WorkCheck.quittingTime IS NULL')
      .andWhere('DATEDIFF(WorkCheck.workDay, :today) = 0', {
        today: new Date(),
      })
      .getOne();

    if (!result) return false;
    else return true;
  }

  async findMemberWorkCheck({ memberId, startDate, endDate }) {
    endDate.setDate(endDate.getDate() + 1);

    const query = this.workCheckRepository
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
      .orderBy('WorkCheck.createdAt', 'DESC');

    const workChecks = await query.getMany();
    const result = [];
    workChecks.map((workCheck) => {
      result.push({
        ...workCheck,
        workingTimeRange: workCheck.schedule
          ? timeRange(
              plusNineHour(workCheck.workingTime),
              workCheck.schedule.startWorkTime,
            )
          : null,

        endTimeRange:
          workCheck.schedule && workCheck.quittingTime
            ? timeRange(
                plusNineHour(workCheck.quittingTime),
                workCheck.schedule.endWorkTime,
              )
            : null,
      });
    });
    return result;
  }

  async findDateMemberWorkCheck({
    companyId,
    organizationId,
    startDate,
    endDate,
    isActiveMember,
  }) {
    // endDate.setDate(endDate.getDate() + 1);

    const filterOrganizationId = organizationId.filter(
      (el: string) => el !== '',
    );

    // const result = [];

    // const schedules = await this.scheduleRepository
    //   .createQueryBuilder('Schedule')
    //   .where('Schedule.date >= :startDate', { startDate })
    //   .leftJoinAndSelect('Schedule.member', 'member')
    //   .andWhere('Schedule.date < :endDate', { endDate })
    //   .getMany();

    // const notWorkChecks = schedules.filter((schedule) => schedule.id === null);

    // const result = notWorkChecks.map((schedule) => {
    //   return {
    //     schedule: schedule,
    //     member: schedule.member,
    //   };
    // });

    if (isActiveMember) {
      const dateRange = timeArr(startDate, endDate);

      const workChecks = await this.workCheckRepository
        .createQueryBuilder('WorkCheck')
        .withDeleted()
        .leftJoinAndSelect('WorkCheck.member', 'member')
        .leftJoinAndSelect('WorkCheck.company', 'company')
        .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
        .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
        .where('WorkCheck.company = :companyId', { companyId })
        .andWhere(
          `WorkCheck.organization IN (:...filterOrganizationId) ${
            organizationId.includes('')
              ? ' OR WorkCheck.organization IS NULL'
              : ''
          }`,
          {
            filterOrganizationId,
          },
        )
        .andWhere('WorkCheck.workDay IN (:...dateRange)', { dateRange })
        .orderBy('WorkCheck.workDay', 'DESC')
        .getMany();

      return workChecks.map((workCheck) => {
        return {
          ...workCheck,
          workingTimeRange: workCheck.schedule
            ? timeRange(
                plusNineHour(workCheck.workingTime),
                workCheck.schedule.startWorkTime,
              )
            : null,
          endTimeRange:
            workCheck.schedule && workCheck.quittingTime !== null
              ? timeRange(
                  plusNineHour(workCheck.quittingTime),
                  workCheck.schedule.endWorkTime,
                )
              : null,
        };
      });
      // return [...result, ...workCheckResult];

      // const workChecks = await Promise.all(
      //   organizationId.map(async (organizationId: string) => {
      //     return await this.workCheckRepository
      //       .createQueryBuilder('WorkCheck')
      //       .withDeleted()
      //       .leftJoinAndSelect('WorkCheck.member', 'member')
      //       .leftJoinAndSelect('WorkCheck.company', 'company')
      //       .leftJoinAndSelect('WorkCheck.organization', 'organization')
      //       .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
      //       .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
      //       .where('WorkCheck.company = :companyId', { companyId })
      //       .andWhere('WorkCheck.organization = :organizationId', {
      //         organizationId,
      //       })
      //       .andWhere(
      //         `WorkCheck.workDay BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      //       )
      //       .orderBy('WorkCheck.workDay', 'DESC')
      //       .getMany();
      //   }),
      // );

      // workChecks.flat().map((workCheck) => {
      //   result.push({
      //     ...workCheck,
      //     workingTimeRange: workCheck.schedule
      //       ? timeRange(
      //           plusNineHour(workCheck.workingTime),
      //           workCheck.schedule.startWorkTime,
      //         )
      //       : null,

      //     endTimeRange:
      //       workCheck.schedule && workCheck.quittingTime
      //         ? timeRange(
      //             plusNineHour(workCheck.quittingTime),
      //             workCheck.schedule.endWorkTime,
      //           )
      //         : null,
      //   });
      // });
    } else {
      const dateRange = timeArr(startDate, endDate);

      const workChecks = await this.workCheckRepository
        .createQueryBuilder('WorkCheck')
        .withDeleted()
        .leftJoinAndSelect('WorkCheck.member', 'member')
        .leftJoinAndSelect('WorkCheck.company', 'company')
        .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
        .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
        .where('WorkCheck.company = :companyId', { companyId })
        .andWhere(
          `WorkCheck.organization IN (:...filterOrganizationId) ${
            organizationId.includes('')
              ? ' OR WorkCheck.organization IS NULL'
              : ''
          }`,
          {
            filterOrganizationId,
          },
        )
        .andWhere('WorkCheck.workDay IN (:...dateRange)', { dateRange })
        .orderBy('WorkCheck.workDay', 'DESC')
        .getMany();

      return workChecks.map((workCheck) => {
        return {
          ...workCheck,
          workingTimeRange: workCheck.schedule
            ? timeRange(
                plusNineHour(workCheck.workingTime),
                workCheck.schedule.startWorkTime,
              )
            : null,
          endTimeRange:
            workCheck.schedule && workCheck.quittingTime !== null
              ? timeRange(
                  plusNineHour(workCheck.quittingTime),
                  workCheck.schedule.endWorkTime,
                )
              : null,
        };
      });
      // const workChecks = await Promise.all(
      //   organizationId.map(async (organizationId: string) => {
      //     return await this.workCheckRepository
      //       .createQueryBuilder('WorkCheck')
      //       .innerJoinAndSelect('WorkCheck.member', 'member')
      //       .leftJoinAndSelect('WorkCheck.company', 'company')
      //       .leftJoinAndSelect('WorkCheck.organization', 'organization')
      //       .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
      //       .leftJoinAndSelect('WorkCheck.roleCategory', 'roleCategory')
      //       .where('member.deletedAt IS NULL')
      //       .andWhere('WorkCheck.company = :companyId', { companyId })
      //       .andWhere('WorkCheck.organization = :organizationId', {
      //         organizationId,
      //       })
      //       .andWhere(
      //         `WorkCheck.workDay BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      //       )
      //       .orderBy('WorkCheck.workDay', 'DESC')
      //       .getMany();
      //   }),
      // );
      // workChecks.flat().map((workCheck) => {
      //   result.push({
      //     ...workCheck,
      //     workingTimeRange: workCheck.schedule
      //       ? timeRange(
      //           plusNineHour(workCheck.workingTime),
      //           workCheck.schedule.startWorkTime,
      //         )
      //       : null,

      //     endTimeRange:
      //       workCheck.schedule && workCheck.quittingTime
      //         ? timeRange(
      //             plusNineHour(workCheck.quittingTime),
      //             workCheck.schedule.endWorkTime,
      //           )
      //         : null,
      //   });
      // });
    }
    // return result.flat();
  }

  async findMonth({ companyId, organizationId, month, isActiveMember }) {
    const monthStartToEnd = getDatesStartToEnd(month);

    const result = [];

    const filterOrganizationId = organizationId.filter(
      (el: string) => el !== '',
    );

    if (isActiveMember) {
      const memberInOrg = await this.memberRepository
        .createQueryBuilder('Member')
        .where('Member.isJoin = :isJoin', { isJoin: true })
        .andWhere('Member.company = :companyId', { companyId })
        .andWhere(
          `Member.organization IN (:...filterOrganizationId) ${
            organizationId.includes('') ? ' OR Member.organization IS NULL' : ''
          }`,
          {
            filterOrganizationId,
          },
        )
        .withDeleted()
        .getMany();

      await Promise.all(
        memberInOrg.map(async (member) => {
          const workChecks = await this.workCheckRepository
            .createQueryBuilder('WorkCheck')
            .withDeleted()
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

          monthStartToEnd.forEach((workDay, i) => {
            const workChecksForDay = workChecks.filter(
              (workCheck) => workCheck.workDay.getDate() === workDay.getDate(),
            );

            // memberWorkCheck.push(workChecksForDay[0] ? [workChecksForDay] : []);
            memberWorkCheck[i] = [...workChecksForDay];
          });

          const temp = {
            member,
            data: memberWorkCheck,
          };
          result.push(temp);
        }),
      );
    } else {
      const memberInOrg = await this.memberRepository
        .createQueryBuilder('Member')
        .where('Member.isJoin = :isJoin', { isJoin: true })
        .andWhere('Member.company = :companyId', { companyId })
        .andWhere(
          `Member.organization IN (:...filterOrganizationId) ${
            organizationId.includes('') ? ' OR Member.organization IS NULL' : ''
          }`,
          {
            filterOrganizationId,
          },
        )
        .getMany();

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

          monthStartToEnd.forEach((workDay, i) => {
            const workChecksForDay = workChecks.filter(
              (workCheck) => workCheck.workDay.getDate() === workDay.getDate(),
            );

            // memberWorkCheck.push(workChecksForDay[0] ? workChecksForDay : []);
            memberWorkCheck[i] = [...workChecksForDay];
          });

          const temp = {
            member,
            data: memberWorkCheck,
          };
          result.push(temp);
        }),
      );
    }

    return result;
  }

  async fetchMain({ companyId }) {
    const today = new Date();
    today.setHours(9, 0, 0, 0);
    const copyDate = new Date();
    const nextDay = new Date(copyDate.setDate(copyDate.getDate() + 1));
    nextDay.setHours(9, 0, 0, 0);

    const totalMember = await this.memberRepository
      .createQueryBuilder('Member')
      .where('Member.company = :companyId', { companyId })
      .getCount();

    const working = await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .leftJoinAndSelect('WorkCheck.member', 'member')
      .where('WorkCheck.company = :companyId', { companyId })
      .andWhere('WorkCheck.workDay BETWEEN :start AND :end', {
        start: today,
        end: nextDay,
      })
      .andWhere('WorkCheck.workingTime IS NOT NULL')
      .getCount();

    const members = await this.memberRepository
      .createQueryBuilder('Member')
      .where('Member.company = :companyId', { companyId })
      .getMany();

    const tardyCount = await Promise.all(
      members.map(async (member) => {
        const schedule = await this.scheduleRepository
          .createQueryBuilder('Schedule')
          .leftJoinAndSelect('Schedule.member', 'member')
          .where('Schedule.member = :memberId', { memberId: member.id })
          .andWhere('Schedule.date BETWEEN :start AND :end', {
            start: today,
            end: nextDay,
          })
          .getOne();

        const createScheduleStart = (scheduleStartTime, today) =>
          new Date(
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(today.getDate()).padStart(
              2,
              '0',
            )}T${scheduleStartTime}:00.000Z`,
          );

        if (schedule) {
          const tardy = await this.workCheckRepository
            .createQueryBuilder('WorkCheck')
            .leftJoinAndSelect('WorkCheck.member', 'member')
            .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
            .where('WorkCheck.company = :companyId', { companyId })
            .where('WorkCheck.member = :memberId', { memberId: member.id })
            .andWhere('WorkCheck.schedule IS NOT NULL')
            .andWhere('WorkCheck.workDay BETWEEN :start AND :end', {
              start: today,
              end: nextDay,
            })
            .andWhere('WorkCheck.workingTime > :scheduleStart', {
              scheduleStart: createScheduleStart(
                schedule.startWorkTime,
                today,
              ).toISOString(),
            })
            .getCount();

          return tardy;
        }
      }),
    );

    const vacation = await this.vacationRepository
      .createQueryBuilder('Vacation')
      .where('Vacation.company = :companyId', { companyId })
      .andWhere('Vacation.vacationStartDate BETWEEN :start AND :end', {
        start: today,
        end: nextDay,
      })
      .getCount();

    const result = [];

    const query = {
      working,
      tardy: tardyCount[0],
      notWorking: totalMember - working - vacation,
      vacation,
    };

    result.push(query);

    return result;
  }

  // async findOmission({ companyId, startDate, endDate }) {
  //   endDate.setDate(endDate.getDate() + 1);

  //   const today = new Date();
  //   today.setHours(9, 0, 0, 0);

  //   const members = await this.memberRepository.find({
  //     where: { company: { id: companyId } },
  //   });

  //   await Promise.all(
  //     members.map(async (member) => {
  //       const quitOmission = await this.workCheckRepository
  //         .createQueryBuilder('WorkCheck')
  //         .leftJoinAndSelect('WorkCheck.member', 'member')
  //         .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
  //         .where('WorkCheck.member = :memberId', { memberId: member.id })
  //         .andWhere(
  //           `WorkCheck.workDay BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
  //         )
  //         // .andWhere('WorkCheck.workDay = :workDay', {workDay.getDate() !== today.getDate()})
  //         .andWhere('WorkCheck.workingTime IS NOT NULL')
  //         .andWhere('WorkCheck.quittingTime IS NULL')
  //         .getMany();
  //       console.log('뭐가나오니?', quitOmission);

  //       return quitOmission;
  //     }),
  //   );
  // }

  async createAdmin({ companyId, createWorkCheckInput }) {
    const { workingTime, quittingTime, ...rest } = createWorkCheckInput;

    const start = workingTime
      ? minusNineHour(changeTime(createWorkCheckInput.workDay, workingTime))
      : undefined;

    const end = quittingTime
      ? minusNineHour(changeTime(createWorkCheckInput.workDay, quittingTime))
      : undefined;

    return await this.workCheckRepository.save({
      ...rest,
      workingTime: start,
      quittingTime: end,
      company: companyId,
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
    const memberInfo = await this.memberRepository.findOne({
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
      .getOne();

    if (duplicateWorkCheck) {
      throw new UnprocessableEntityException('이미 출근하셨습니다.');
    }

    const result = await this.workCheckRepository.save({
      company: memberInfo.company,
      member: memberId,
      organization: memberInfo.organization,
      roleCategory: memberInfo.roleCategory,
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
    let { workDay, workingTime, quittingTime } = updateWorkCheckInput;

    if (updateWorkCheckInput.isWorking) {
      quittingTime = null;
    }

    if (workDay) {
      workDay = new Date(workDay);
      if (workingTime) {
        workingTime = minusNineHour(changeTime(workDay, workingTime));
      }
      if (quittingTime) {
        quittingTime = minusNineHour(changeTime(workDay, quittingTime));
      }
      if (!workingTime && !quittingTime) {
        workingTime = new Date(findWorkCheck.workingTime);
        workingTime.setFullYear(workDay.getFullYear());
        workingTime.setMonth(workDay.getMonth());
        workingTime.setDate(workDay.getDate());
        if (findWorkCheck.quittingTime) {
          quittingTime = new Date(findWorkCheck.quittingTime);
          quittingTime.setFullYear(workDay.getFullYear());
          quittingTime.setMonth(workDay.getMonth());
          quittingTime.setDate(workDay.getDate());
        }
      }
    }

    if (workingTime && quittingTime && !workDay) {
      workingTime = minusNineHour(
        changeTime(new Date(findWorkCheck.workDay), workingTime),
      );
      quittingTime = minusNineHour(
        changeTime(new Date(findWorkCheck.workDay), quittingTime),
      );
    } else if (workingTime && !workDay) {
      workingTime = minusNineHour(
        changeTime(new Date(findWorkCheck.workDay), workingTime),
      );
    } else if (quittingTime && !workDay) {
      quittingTime = minusNineHour(
        changeTime(new Date(findWorkCheck.workDay), quittingTime),
      );
    }

    const updateObj = Object.assign({}, findWorkCheck, updateWorkCheckInput);

    const { organizationId, roleCategoryId, ...rest } = updateObj;

    if (organizationId !== findWorkCheck.organization) {
      await this.memberRepository.update(
        { id: findWorkCheck.member.id },
        { organization: organizationId },
      );
    }

    if (roleCategoryId !== findWorkCheck.roleCategory) {
      await this.memberRepository.update(
        { id: findWorkCheck.member.id },
        { roleCategory: roleCategoryId },
      );
    }

    return await this.workCheckRepository.save({
      ...findWorkCheck,
      id: workCheckId,
      ...rest,
      workDay,
      workingTime,
      quittingTime,
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
            member: true,
          },
        });

        const updateObj = Object.assign({}, origin, updateWorkCheckInput);

        let { workingTime, quittingTime } = updateWorkCheckInput;

        if (workingTime) {
          workingTime = minusNineHour(changeTime(new Date(), workingTime));
        }

        if (quittingTime) {
          quittingTime = minusNineHour(changeTime(new Date(), quittingTime));
        }

        const { organizationId, roleCategoryId, ...rest } = updateObj;

        if (organizationId !== origin.organization) {
          await this.memberRepository.update(
            { id: origin.member.id },
            { organization: organizationId },
          );
        }

        if (roleCategoryId !== origin.roleCategory) {
          await this.memberRepository.update(
            { id: origin.member.id },
            { roleCategory: roleCategoryId },
          );
        }

        if (origin.schedule === null) {
          return await this.workCheckRepository.save({
            ...origin,
            id: workCheckId,
            ...rest,
            workingTime,
            quittingTime,
            organization: organizationId,
            roleCategory: roleCategoryId,
          });
        } else {
          return await this.workCheckRepository.save({
            ...origin,
            id: workCheckId,
            ...rest,
            workingTime,
            quittingTime,
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
