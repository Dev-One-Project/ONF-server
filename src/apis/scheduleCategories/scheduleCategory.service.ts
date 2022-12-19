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

  async findAll() {
    return await this.scheduleCategoryRepository.find();
  }

  async create({ createScheduleCategoryInput }) {
    // const { companyId, ...scheduleCategory } = createScheduleCategoryInput;

    return await this.scheduleCategoryRepository.save({
      // ...scheduleCategory,
      // company: companyId,
      ...createScheduleCategoryInput,
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

  async delete({ scheduleCategoryId }) {
    const result = await this.scheduleCategoryRepository.delete({
      id: scheduleCategoryId,
    });

    return result.affected ? true : false;
  }
}
