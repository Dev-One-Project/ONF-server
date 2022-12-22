import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { currentWeek } from 'src/common/libraries/utils';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { Organization } from '../organization/entities/organization.entity';
import { ScheduleTemplate } from '../scheduleTemplates/entities/scheduleTemplate.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>, //

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(ScheduleTemplate)
    private readonly scheduleTemplateRepository: Repository<ScheduleTemplate>,
  ) {}

  async weekFind({ today, companyId }) {
    const week = currentWeek(today);
    const startWeek = new Date(week[0]);
    const end = new Date(week[1]);
    const endWeek = new Date(end.setDate(end.getDate() + 1));

    const result = await this.scheduleRepository
      .createQueryBuilder('Schedule')
      .leftJoinAndSelect('Schedule.member', 'member')
      .leftJoinAndSelect('Schedule.organization', 'organization')
      .leftJoinAndSelect('Schedule.roleCategory', 'roleCategory')
      .leftJoinAndSelect('Schedule.scheduleTemplate', 'scheduleTemplate')
      .leftJoinAndSelect('Schedule.company', 'company')
      .leftJoinAndSelect('Schedule.scheduleCategory', 'scheduleCategory')
      .where('Schedule.company = :companyId', { companyId })
      .andWhere(
        `Schedule.date BETWEEN '${startWeek.toISOString()}' AND '${endWeek.toISOString()}'`,
      )
      .orderBy('Schedule.date', 'ASC')
      .getMany();

    return result;
  }

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

  async create({ dates, createScheduleInput }) {
    // 날짜가 배열로 들어옴
    const { scheduleTemplateId, organizationId, memberId } =
      createScheduleInput;

    const template = await this.scheduleTemplateRepository.findOne({
      where: { id: scheduleTemplateId },
      relations: ['organization', 'roleCategory', 'scheduleCategory'],
    });

    const result = [];

    await Promise.all(
      dates.map(async (date: Date) => {
        await Promise.all(
          organizationId.map(async (organizationId: string) => {
            await Promise.all(
              memberId.map(async (member) => {
                const info = await this.memberRepository.findOne({
                  where: { id: member, organization: { id: organizationId } },
                  relations: ['organization', 'company', 'roleCategory'],
                });

                if (info) {
                  const schedule = await this.scheduleRepository.save({
                    date,
                    scheduleTemplate: scheduleTemplateId,
                    startWorkTime: template.startTime,
                    endWorkTime: template.endTime,
                    member,
                    scheduleCategory: template.scheduleCategory,
                    company: info.company,
                    organization: info.organization,
                    roleCategory: info.roleCategory,
                  });
                  result.push(schedule);
                }
              }),
            );
          }),
        );
      }),
    );

    return result;
  }

  async updateOne({ scheduleId, updateScheduleInput }) {
    const origin = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });

    return await this.scheduleRepository.save({
      ...origin,
      id: scheduleId,
      ...updateScheduleInput,
    });
  }

  async updateAll({ scheduleId, updateScheduleInput }) {
    const result = await Promise.all(
      scheduleId.map(async (schedule) => {
        const origin = await this.scheduleRepository.findOne({
          where: { id: schedule },
        });

        return await this.scheduleRepository.save({
          ...origin,
          id: schedule,
          ...updateScheduleInput,
        });
      }),
    );

    return result;
  }

  async deleteOne({ scheduleId }) {
    const result = await this.scheduleRepository.delete({ id: scheduleId });

    return result.affected ? true : false;
  }

  async deleteAll({ scheduleId }) {
    await Promise.all(
      scheduleId.map(async (schedule) => {
        await this.scheduleRepository.delete({ id: schedule });
      }),
    );

    return '삭제 완료';
  }
}
