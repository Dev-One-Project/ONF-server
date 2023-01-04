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

  async weekFind({ today, organizationId, roleCategoryId }) {
    const week = currentWeek(today);
    const startWeek = new Date(week[0]);
    const end = new Date(week[1]);
    const endWeek = new Date(end.setDate(end.getDate() + 1));

    const result = [];

    await Promise.all(
      organizationId.map(async (organizationId) => {
        await Promise.all(
          roleCategoryId.map(async (roleCategoryId) => {
            const schedule = await this.scheduleRepository
              .createQueryBuilder('Schedule')
              .leftJoinAndSelect('Schedule.member', 'member')
              .leftJoinAndSelect('Schedule.organization', 'organization')
              .leftJoinAndSelect('Schedule.roleCategory', 'roleCategory')
              .leftJoinAndSelect(
                'Schedule.scheduleTemplate',
                'scheduleTemplate',
              )
              .leftJoinAndSelect('Schedule.company', 'company')
              .leftJoinAndSelect(
                'Schedule.scheduleCategory',
                'scheduleCategory',
              )
              .where('Schedule.organization = :organizationId', {
                organizationId,
              })
              .andWhere('Schedule.roleCategory = :roleCategoryId', {
                roleCategoryId,
              })
              .andWhere(
                `Schedule.date BETWEEN '${startWeek.toISOString()}' AND '${endWeek.toISOString()}'`,
              )
              .orderBy('member.name', 'ASC')
              .addOrderBy('Schedule.date', 'ASC')
              .getMany();

            result.push(schedule);
          }),
        );
      }),
    );

    return result.flat();
  }

  // TODO : 오름차순 내림차순 선택할 수 있게 하자
  async listFind({ startDate, endDate, organizationId }) {
    endDate.setDate(endDate.getDate() + 1);

    const result = await Promise.all(
      organizationId.map(async (organizationId) => {
        return await this.scheduleRepository
          .createQueryBuilder('Schedule')
          .leftJoinAndSelect('Schedule.company', 'company')
          .leftJoinAndSelect('Schedule.member', 'member')
          .leftJoinAndSelect('Schedule.scheduleCategory', 'scheduleCategory')
          .leftJoinAndSelect('Schedule.organization', 'organization')
          .leftJoinAndSelect('Schedule.roleCategory', 'roleCategory')
          .leftJoinAndSelect('Schedule.scheduleTemplate', 'scheduleTemplate')
          .where('Schedule.organization = :organizationId', { organizationId })
          .andWhere(
            `Schedule.date BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
          )
          .orderBy('Schedule.date', 'DESC')
          .getMany();
      }),
    );

    return result.flat();
  }

  async create({ dates, createScheduleInput }) {
    const { scheduleTemplateId, memberId } = createScheduleInput;

    const template = await this.scheduleTemplateRepository.findOne({
      where: { id: scheduleTemplateId },
      relations: ['organization', 'roleCategory', 'scheduleCategory'],
    });

    const result = [];

    await Promise.all(
      dates.map(async (date: Date) => {
        await Promise.all(
          memberId.map(async (member) => {
            const info = await this.memberRepository.findOne({
              where: { id: member },
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

    return result;
  }

  async updateOne({ scheduleId, updateScheduleInput }) {
    const origin = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: [
        'member',
        'company',
        'organization',
        'roleCategory',
        'scheduleTemplate',
        'scheduleCategory',
      ],
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
          relations: [
            'member',
            'company',
            'organization',
            'roleCategory',
            'scheduleTemplate',
            'scheduleCategory',
          ],
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

  async deleteMany({ scheduleId }) {
    await Promise.all(
      scheduleId.map(async (schedule) => {
        await this.scheduleRepository.delete({ id: schedule });
      }),
    );

    return '삭제 완료';
  }
}
