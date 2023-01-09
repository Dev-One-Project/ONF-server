import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { VacationCategory } from './entities/vacationCategory.entity';

@Injectable()
export class VacationCategoryService {
  constructor(
    @InjectRepository(VacationCategory)
    private readonly vacationCategoryReoisitory: Repository<VacationCategory>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(RoleCategory)
    private readonly roleCategoryRepository: Repository<RoleCategory>,
  ) {}
  async findAll({ organizationid }) {
    return await this.vacationCategoryReoisitory
      .createQueryBuilder('vacationCategory')
      .leftJoinAndSelect('vacationCategory.organization', 'organization')
      .leftJoinAndSelect('vacationCategory.roleCategory', 'roleCategory')
      .where('organization.id = :organizationid', { organizationid })
      .getMany();
  }

  async findOne({ vacationCategoryId }) {
    return this.vacationCategoryReoisitory.findOne({
      where: { id: vacationCategoryId },
    });
  }
  async create({ createVacationCategoryInput }) {
    const organization = await this.organizationRepository.findOne({
      where: { id: createVacationCategoryInput.organizationId },
    });
    const Role = await this.roleCategoryRepository.findOne({
      where: { id: createVacationCategoryInput.roleCategoryId },
    });
    const result = await this.vacationCategoryReoisitory.save({
      organization,
      roleCategory: Role,
      ...createVacationCategoryInput,
    });
    return result;
  }

  async update({ vacationCategoryId, updateVacationCategoryInput }) {
    const vacationCategoryOne = await this.vacationCategoryReoisitory.findOne({
      where: { id: vacationCategoryId },
    });
    const result = await this.vacationCategoryReoisitory.save({
      ...vacationCategoryOne,
      id: vacationCategoryId,
      ...updateVacationCategoryInput,
    });
    return result;
  }

  async delete({ vacationCategoryId }) {
    const result = await this.vacationCategoryReoisitory.delete({
      id: vacationCategoryId,
    });
    return result.affected ? true : false;
  }
}
