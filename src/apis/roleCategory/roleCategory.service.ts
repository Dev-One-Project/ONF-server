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
    private readonly roleCategoryRepositoy: Repository<RoleCategory>,

    @InjectRepository(Company)
    private readonly companyReposistory: Repository<Company>,
  ) {}

  async create(createRoleCategoryInput: IRoleCategory): Promise<RoleCategory> {
    const { companyId, ...roleCategory } = createRoleCategoryInput;
    const company = await this.companyReposistory.findOne({
      where: { id: companyId },
    });

    const result = await this.roleCategoryRepositoy.save({
      ...createRoleCategoryInput,
      company,
    });
    return result;
  }

  async update({ roleCategoryId, updateRoleCategoryInput }) {
    const updateRole: RoleCategory = await this.roleCategoryRepositoy.findOne({
      where: { id: roleCategoryId },
      relations: [
        'company', //
      ],
    });

    const result = await this.roleCategoryRepositoy.save({
      ...updateRole,
      ...updateRoleCategoryInput,
    });
    return result;
  }

  async findAll({ companyId }): Promise<RoleCategory[]> {
    return await this.roleCategoryRepositoy
      .createQueryBuilder('roleCategory')
      .leftJoinAndSelect('roleCategory.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();
  }

  async findOne({ roleCategoryId }): Promise<RoleCategory> {
    return await this.roleCategoryRepositoy.findOne({
      where: { id: roleCategoryId },
      relations: [
        'company', //
      ],
    });
  }

  async remove({ roleCategoryId }): Promise<boolean> {
    const result = await this.roleCategoryRepositoy.softDelete({
      id: roleCategoryId,
    });
    return result.affected ? true : false;
  }
}
