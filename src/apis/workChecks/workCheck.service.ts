import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { WorkCheck } from './entities/workCheck.entity';
import {
  getToday,
  totalTime,
  updateTotalTime,
} from 'src/common/libraries/utils';
import { minusNineHour } from 'src/common/libraries/utils';
import { dayOfTheWeek } from 'src/common/libraries/utils';
import { WorkCheckOutput } from './dto/workCheck.output';

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
      .where('WorkCheck.member = :id', { id: memberId })
      .orderBy('WorkCheck.createdAt', 'DESC')
      .getMany();
  }

  async findDateMemberWorkCheck({ companyId, startDate, endDate }) {
    // const start = new Date(startDate);
    // start.setHours(0, 0, 0, 0);

    // const end = new Date(endDate);
    endDate.setDate(endDate.getDate() + 1);

    return await this.workCheckRepository
      .createQueryBuilder('WorkCheck')
      .leftJoinAndSelect('WorkCheck.member', 'member')
      .leftJoinAndSelect('WorkCheck.company', 'company')
      .leftJoinAndSelect('WorkCheck.organization', 'organization')
      .leftJoinAndSelect('WorkCheck.schedule', 'schedule')
      .where('WorkCheck.company = :id', { id: companyId })
      .andWhere(
        `WorkCheck.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      )
      .orderBy('WorkCheck.createdAt', 'DESC')
      .getMany();
  }

  async createStartWork({ memberId }) {
    const result = await this.workCheckRepository.save({
      member: memberId,
      workDay: getToday(),
      workingTime: new Date(),
    });

    return result;
  }

  async createEndWork({ workCheckId }) {
    const origin = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    const startWork = origin.workingTime;
    const originStartWork = new Date(startWork);

    startWork.setHours(startWork.getHours() + 9);

    return await this.workCheckRepository.save({
      ...origin,
      id: workCheckId,
      quittingTime: new Date(),
      totalWorkTime: totalTime(startWork, new Date()),
      workingTime: originStartWork,
    });
  }

  async createStartBreak({ workCheckId }) {
    const origin = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    return await this.workCheckRepository.save({
      ...origin,
      id: workCheckId,
      breakStartTime: new Date(),
    });
  }

  async createEndBreak({ workCheckId }) {
    const origin = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    const startBreak = origin.breakStartTime;
    const originStartBreak = new Date(startBreak);

    startBreak.setHours(startBreak.getHours() + 9);

    return await this.workCheckRepository.save({
      ...origin,
      id: workCheckId,
      breakFinishTime: new Date(),
      totalBreakTime: totalTime(startBreak, new Date()),
      breakStartTime: originStartBreak,
    });
  }

  async update({ workCheckId, updateWorkCheckInput }) {
    const { workingTime, quittingTime, breakStartTime, breakFinishTime } =
      updateWorkCheckInput;

    const findWorkCheck = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    let result: object;

    if (workingTime && !quittingTime) {
      const updateWorkingTime = new Date(workingTime);
      updateWorkingTime.setHours(updateWorkingTime.getHours() - 9);

      result = this.workCheckRepository.create({
        ...findWorkCheck,
        id: workCheckId,
        workingTime: minusNineHour(workingTime),
        totalWorkTime: updateTotalTime(
          updateWorkingTime,
          findWorkCheck.quittingTime,
        ),
      });
    }

    if (quittingTime && !workingTime) {
      const updateQuittingTime = new Date(quittingTime);
      updateQuittingTime.setHours(updateQuittingTime.getHours() - 9);

      result = this.workCheckRepository.create({
        ...findWorkCheck,
        id: workCheckId,
        quittingTime: minusNineHour(quittingTime),
        totalWorkTime: updateTotalTime(
          findWorkCheck.workingTime,
          updateQuittingTime,
        ),
      });
    }

    if (workingTime && quittingTime) {
      const updateWorkingTime = new Date(workingTime);
      const updateQuittingTime = new Date(quittingTime);

      result = this.workCheckRepository.create({
        ...findWorkCheck,
        id: workCheckId,
        workingTime: minusNineHour(workingTime),
        quittingTime: minusNineHour(quittingTime),
        totalWorkTime: updateTotalTime(updateWorkingTime, updateQuittingTime),
      });
      console.log(result);
    }

    if (breakStartTime && !breakFinishTime) {
      const updateStartBreak = new Date(breakStartTime);
      updateStartBreak.setHours(updateStartBreak.getHours() - 9);

      result = this.workCheckRepository.create({
        ...findWorkCheck,
        id: workCheckId,
        breakStartTime: minusNineHour(breakStartTime),
        totalBreakTime: updateTotalTime(
          updateStartBreak,
          findWorkCheck.breakFinishTime,
        ),
      });
    }

    if (breakFinishTime && !breakStartTime) {
      const updateFinishBreak = new Date(breakFinishTime);
      updateFinishBreak.setHours(updateFinishBreak.getHours() - 9);

      result = this.workCheckRepository.create({
        ...findWorkCheck,
        id: workCheckId,
        breakFinishTime: minusNineHour(breakFinishTime),
        totalBreakTime: updateTotalTime(
          findWorkCheck.breakStartTime,
          updateFinishBreak,
        ),
      });
    }

    if (breakStartTime && breakFinishTime) {
      const updateStartBreak = new Date(breakStartTime);
      const updateFinishBreak = new Date(breakFinishTime);

      result = this.workCheckRepository.create({
        ...findWorkCheck,
        id: workCheckId,
        breakStartTime: minusNineHour(breakStartTime),
        breakFinishTime: minusNineHour(breakFinishTime),
        totalBreakTime: updateTotalTime(updateStartBreak, updateFinishBreak),
      });
    }

    return await this.workCheckRepository.save({
      ...result,
    });

    // const result = await this.workCheckRepository.save({
    //   ...findWorkCheck,
    //   id: workCheckId,
    //   workingTime: minusNineHour(workingTime),
    //   quittingTime: minusNineHour(quittingTime),
    // });

    // console.log(result);

    // return result;
  }

  async delete({ workCheckId }) {
    const result = await this.workCheckRepository.delete({
      id: workCheckId,
    });

    return result.affected ? true : false;
  }
}
