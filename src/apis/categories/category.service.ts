import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../companies/company.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly companyService: CompanyService,
  ) {}
  private sqlInit = this.categoryRepository.createQueryBuilder('category');

  async findAll({ companyId }) {
    return await this.sqlInit
      .leftJoinAndSelect('category.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();
  }

  async getCategoryDetail({ categoryId }) {
    return await this.sqlInit
      .leftJoinAndSelect('category.company', 'company')
      .where('category.id = :categoryId', { categoryId })
      .getOne();
  }

  async create({ createCategoryInput }) {
    return await this.sqlInit
      .insert()
      .into(Category)
      .values(createCategoryInput)
      .execute();
  }

  async update({ categoryId, updateCategoryInput }) {
    const category = this.getCategoryDetail({ categoryId });
    const updateData = {
      ...category,
      ...updateCategoryInput,
    };
    return await this.sqlInit
      .update(Category)
      .set(updateData)
      .where('id = :categoryId', { categoryId })
      .execute();
  }

  async delete({ categoryId }) {
    const result = await this.sqlInit
      .delete()
      .from(Category)
      .where('id = :categoryId', { categoryId })
      .execute();
    return result.affected ? true : false;
  }
}
