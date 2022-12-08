import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRoleCategory } from 'src/common/types/roleCategory.types';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { RoleCategory } from './entities/roleCategory.entity';

@Injectable()
export class RoleCategoryService {
  constructor(
    @InjectRepository(RoleCategory)
    private readonly RoleCategoryRepositoy: Repository<RoleCategory>,

    @InjectRepository(Company)
    private readonly CompnayReposistory: Repository<Company>,
  ) {}

  async create(createRoleCategoryInput: IRoleCategory): Promise<RoleCategory> {
    const { companyId, ...roleCategory } = createRoleCategoryInput;

    const result = await this.RoleCategoryRepositoy.save({
      ...roleCategory,
      company: { id: companyId },
    });
    console.log(result);
    return result;
  }

  async update({ roleCategoryId, updateRoleCategoryInput }) {
    const updateRole: RoleCategory = await this.findOne({ roleCategoryId });

    const result = await this.RoleCategoryRepositoy.save({
      ...updateRole,
      roleCategoryId: updateRole.id,
      ...updateRoleCategoryInput,
    });
    return result;
  }

  async findAll(): Promise<RoleCategory[]> {
    return await this.RoleCategoryRepositoy.find({
      relations: ['company'],
    });
  }

  async findOne({ roleCategoryId }): Promise<RoleCategory> {
    return await this.RoleCategoryRepositoy.findOne({
      where: { id: roleCategoryId },
      relations: [
        'company', //
      ],
    });
  }

  async remove({ roleCategoryId }): Promise<boolean> {
    const result = await this.RoleCategoryRepositoy.softDelete({
      id: roleCategoryId,
    });
    return result.affected ? true : false;
  }
}
