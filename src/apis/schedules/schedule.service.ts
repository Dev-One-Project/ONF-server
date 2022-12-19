import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>, //
  ) {}

  async findMemberScheduleDetail({ memberId }) {
    const result = await this.scheduleRepository
      .createQueryBuilder('Schedule')
      .leftJoinAndSelect('Schedule.member', 'member')
      .leftJoinAndSelect('Schedule.roleCategory', 'roleCategory')
      .leftJoinAndSelect('Schedule.organization', 'organization')
      .where('Schedule.member = :id', { id: memberId })
      .getOne();

    return result;
  }

  async create({ createScheduleInput }) {
    return await this.scheduleRepository.save({
      ...createScheduleInput,
    });
  }

  async update({ scheduleId, updateScheduleInput }) {
    const findSchedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });

    return await this.scheduleRepository.save({
      ...findSchedule,
      id: scheduleId,
      ...updateScheduleInput,
    });
  }

  async delete({ scheduleId }) {
    const result = await this.scheduleRepository.delete({ id: scheduleId });

    return result.affected ? true : false;
  }
}
