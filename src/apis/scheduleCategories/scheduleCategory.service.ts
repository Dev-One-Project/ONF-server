import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleCategory } from './entities/scheduleCategory.entity';

@Injectable()
export class ScheduleCategoryService {
  constructor(
    @InjectRepository(ScheduleCategory)
    private readonly scheduleCategoryRepository: Repository<ScheduleCategory>, //
  ) {}

  async findAll({ companyId }) {
    return await this.scheduleCategoryRepository.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async create({ companyId, createScheduleCategoryInput }) {
    return await this.scheduleCategoryRepository.save({
      ...createScheduleCategoryInput,
      company: companyId,
    });
  }

  async update({ scheduleCategoryId, updateScheduleCategoryInput }) {
    const origin = await this.scheduleCategoryRepository.findOne({
      where: { id: scheduleCategoryId },
    });

    return await this.scheduleCategoryRepository.save({
      ...origin,
      id: scheduleCategoryId,
      ...updateScheduleCategoryInput,
    });
  }

  async deleteOne({ scheduleCategoryId }) {
    const result = await this.scheduleCategoryRepository.delete({
      id: scheduleCategoryId,
    });

    return result.affected ? true : false;
  }

  async deleteMany({ scheduleCategoryId }) {
    let result = true;
    for await (const id of scheduleCategoryId) {
      const deletes = await this.scheduleCategoryRepository.delete({ id });

      if (!deletes.affected) result = false;
    }
    return result;
  }
}
