import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleTemplate } from './entities/scheduleTemplate.entity';

@Injectable()
export class ScheduleTemplateService {
  constructor(
    @InjectRepository(ScheduleTemplate)
    private readonly scheduleTemplateRepository: Repository<ScheduleTemplate>, //
  ) {}

  async findAll() {
    return await this.scheduleTemplateRepository.find({
      relations: ['organization', 'roleCategory', 'scheduleCategory'],
    });
  }

  async create({ createScheduleTemplateInput }) {
    const {
      scheduleCategoryId,
      organizationId,
      roleCategoryId,
      ...scheduleTemplate
    } = createScheduleTemplateInput;

    return await this.scheduleTemplateRepository.save({
      ...scheduleTemplate,
      organization: organizationId,
      roleCategory: roleCategoryId,
      scheduleCategory: scheduleCategoryId,
    });
  }

  async update({ scheduleTemplateId, updateScheduleTemplateInput }) {
    const origin = await this.scheduleTemplateRepository.findOne({
      where: { id: scheduleTemplateId },
    });

    return await this.scheduleTemplateRepository.save({
      ...origin,
      id: scheduleTemplateId,
      ...updateScheduleTemplateInput,
    });
  }

  async delete({ scheduleTemplateId }) {
    const result = await this.scheduleTemplateRepository.delete({
      id: scheduleTemplateId,
    });

    return result.affected ? true : false;
  }
}
