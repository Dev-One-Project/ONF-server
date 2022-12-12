import { All, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { WorkCheck } from './entities/workCheck.entity';
import { getToday } from 'src/common/libraries/utils';
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
      relations: ['company', 'category', 'organization'],
    });

    // 당일에 한번 찍었으면 또 안생기게 검증 로직 써야함

    const result = await this.workCheckRepository.save({
      member: memberId,
      company: member.company,
      workDay: getToday(),
      workingTime: new Date(),
    });

    return result;
  }

  async createEndWork({ workCheckId }) {
    const origin = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
    });

    // const startWork = origin.workingTime;
    // const originStartWork = new Date(startWork);

    // startWork.setHours(startWork.getHours() + 9);

    return await this.workCheckRepository.save({
      ...origin,
      id: workCheckId,
      quittingTime: new Date(),
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

    // const startBreak = origin.breakStartTime;
    // const originStartBreak = new Date(startBreak);

    // startBreak.setHours(startBreak.getHours() + 9);

    return await this.workCheckRepository.save({
      ...origin,
      id: workCheckId,
      breakEndTime: new Date(),
    });
  }

  async update({ workCheckId, updateWorkCheckInput }) {
    const { workingTime, quittingTime, breakStartTime, breakEndTime } =
      updateWorkCheckInput;

    const findWorkCheck = await this.workCheckRepository.findOne({
      where: { id: workCheckId },
      // relations: ['member', 'organization', 'schedule'],
    });

    const arr = Object.entries(findWorkCheck);
    const qqq = Object.keys(updateWorkCheckInput);

    const sibal = {};

    await Promise.all(
      qqq.map((a) => {
        return arr.filter((x) => {
          if (x[0] === a) {
            return (sibal[a] = updateWorkCheckInput[a]);
          }
        });
      }),
    );

    workingTime?.setHours(workingTime.getHours() - 9);
    quittingTime?.setHours(quittingTime.getHours() - 9);
    breakStartTime?.setHours(breakStartTime.getHours() - 9);
    breakEndTime?.setHours(breakEndTime.getHours() - 9);

    return await this.workCheckRepository.save({
      ...findWorkCheck,
      id: workCheckId,
      ...sibal,
    });
  }

  async delete({ workCheckId }) {
    const result = await this.workCheckRepository.delete({
      id: workCheckId,
    });

    return result.affected ? true : false;
  }
}
