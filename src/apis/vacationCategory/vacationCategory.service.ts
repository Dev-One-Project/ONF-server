import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
  async findAll() {
    return await this.vacationCategoryReoisitory.find({
      relations: ['organization', 'roleCategory'],
    });
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
    const organization = await this.organizationRepository.findOne({
      where: { id: updateVacationCategoryInput.organizationId },
    });
    const roleCategory = await this.roleCategoryRepository.findOne({
      where: { id: updateVacationCategoryInput.roleCategoryId },
    });

    const result = await this.vacationCategoryReoisitory.save({
      ...vacationCategoryOne,
      id: vacationCategoryId,
      organization,
      roleCategory,
      ...updateVacationCategoryInput,
    });
    return result;
  }

  async updateMany({ vacationCategoryId, updateVacationCategoryInput }) {
    const category = await Promise.all(
      vacationCategoryId.map(async (vacationCategoryId: string) => {
        const findCategory = await this.vacationCategoryReoisitory.findOne({
          where: { id: vacationCategoryId },
        });
        if (!findCategory) {
          throw new UnprocessableEntityException(
            '존재하지 않은 휴가유형입니다.',
          );
        }
        const organization = await this.organizationRepository.findOne({
          where: { id: updateVacationCategoryInput.organizationId },
        });
        const roleCategory = await this.roleCategoryRepository.findOne({
          where: { id: updateVacationCategoryInput.roleCategoryId },
        });

        const result = await this.vacationCategoryReoisitory.save({
          ...findCategory,
          id: vacationCategoryId,
          organization,
          roleCategory,
          ...updateVacationCategoryInput,
        });

        return result;
      }),
    );
    return category;
  }

  async delete({ vacationCategoryId }) {
    const result = await this.vacationCategoryReoisitory.delete({
      id: vacationCategoryId,
    });
    return result.affected ? true : false;
  }

  async deleteMany({ vacationCategoryId }) {
    let result = true;

    for await (const id of vacationCategoryId) {
      const deletes = await this.vacationCategoryReoisitory.delete({ id });

      if (!deletes.affected) result = false;
    }
    return result;
  }
}
