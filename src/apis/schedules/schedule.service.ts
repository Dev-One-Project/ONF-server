import {
  Injectable,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findMemberSchedule({ memberId, date }) {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const result = await this.scheduleRepository
      .createQueryBuilder('Schedule')
      .where('Schedule.member = :memberId', { memberId })
      .andWhere(
        `Schedule.date BETWEEN '${date.toISOString()}' AND '${endDate.toISOString()}'`,
      )
      .getOne();

    if (!result) {
      return null;
    }

    return result;
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
          // .addOrderBy('member.name', 'ASC') 안되네??
          .getMany();
      }),
    );

    return result.flat();
  }

  async create({ dates, createScheduleInput }) {
    // const { scheduleTemplateId, memberId } = createScheduleInput;

    // const template = await this.scheduleTemplateRepository.findOne({
    //   where: { id: scheduleTemplateId },
    //   relations: ['organization', 'roleCategory', 'scheduleCategory'],
    // });

    // const result = [];

    // await Promise.all(
    //   dates.map(async (date: Date) => {
    //     await Promise.all(
    //       memberId.map(async (member) => {
    //         const info = await this.memberRepository.findOne({
    //           where: { id: member },
    //           relations: ['organization', 'company', 'roleCategory'],
    //         });

    //         if (info) {
    //           const schedule = await this.scheduleRepository.save({
    //             date,
    //             scheduleTemplate: scheduleTemplateId,
    //             startWorkTime: template.startTime,
    //             endWorkTime: template.endTime,
    //             member,
    //             scheduleCategory: template.scheduleCategory,
    //             company: info.company,
    //             organization: info.organization,
    //             roleCategory: info.roleCategory,
    //           });
    //           result.push(schedule);
    //         }
    //       }),
    //     );
    //   }),
    // );

    // return result;

    const { scheduleTemplateId, memberId } = createScheduleInput;

    const template = await this.scheduleTemplateRepository.findOne({
      where: { id: scheduleTemplateId },
      relations: ['scheduleCategory'],
    });

    const members = await this.memberRepository
      .createQueryBuilder('Member')
      .leftJoinAndSelect('Member.company', 'company')
      .leftJoinAndSelect('Member.organization', 'organization')
      .leftJoinAndSelect('Member.roleCategory', 'roleCategory')
      .where('Member.id IN (:...memberId)', { memberId })
      .getMany();

    const result = [];

    dates.forEach((date) => {
      members.forEach((member) => {
        result.push({
          date,
          startWorkTime: template.startTime,
          endWorkTime: template.endTime,
          scheduleTemplate: scheduleTemplateId,
          member: member.id,
          scheduleCategory: template.scheduleCategory,
          company: member.company,
          organization: member.organization,
          roleCategory: member.roleCategory,
        });
      });
    });

    await this.scheduleRepository.save(result);

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

    const { scheduleCategoryId, organizationId, roleCategoryId, ...rest } =
      updateScheduleInput;

    return await this.scheduleRepository.save({
      ...origin,
      id: scheduleId,
      ...rest,
      scheduleCategory: scheduleCategoryId,
      organization: organizationId,
      roleCategory: roleCategoryId,
    });
  }

  async updateMany({ scheduleId, updateScheduleInput }) {
    const result = await Promise.all(
      scheduleId.map(async (scheduleId) => {
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

        const { scheduleCategoryId, organizationId, roleCategoryId, ...rest } =
          updateScheduleInput;

        return await this.scheduleRepository.save({
          ...origin,
          id: scheduleId,
          ...rest,
          scheduleCategory: scheduleCategoryId,
          organization: organizationId,
          roleCategory: roleCategoryId,
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
    // await Promise.all(
    //   scheduleId.map(async (schedule) => {
    //     await this.scheduleRepository.delete({ id: schedule });
    //   }),
    // );

    // return '삭제 완료';

    let result = true;
    for await (const id of scheduleId) {
      const deletes = await this.scheduleRepository.delete({ id });

      if (!deletes.affected) result = false;
    }
    return result;
  }
}
