import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../companies/company.service';
import { Member } from '../members/entities/member.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
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
    const company = await this.companyService.getCompanyDetail({
      companyId: createCategoryInput.companyId,
    });
    const category = this.categoryRepository.create({
      ...createCategoryInput,
      company,
    });
    return await this.sqlInit
      .insert()
      .into(Category)
      .values(category)
      .execute();
  }

  async update({ categoryId, updateCategoryInput }) {
    const category = this.getCategoryDetail({ categoryId });
    const company = await this.companyService.getCompanyDetail({
      companyId: updateCategoryInput.companyId,
    });
    const updateData = {
      ...category,
      ...updateCategoryInput,
      company,
    };
    return await this.sqlInit
      .update(Category)
      .set(updateData)
      .where('id = :categoryId', { categoryId })
      .execute();
  }

  async delete({ categoryId }) {
    //TODO: get all schedule by organizationId and remove relation with organization
    //TODO: get all LeaveCategory by organizationId and remove relation with organization

    //TODO: get all member by organizationId and remove relation with organization
    // const members = await this.memberRepository
    //   .createQueryBuilder('member')
    //   .leftJoinAndSelect('member.category', 'category')
    //   .where('category.id = :categoryId', { categoryId })
    //   .getMany();

    // members.forEach(async (member) => {
    //   await this.memberRepository
    //     .createQueryBuilder('member')
    //     .update(Member)
    //     .set({ category: null })
    //     .where('id = :memberId', { memberId: member.id })
    //     .execute();
    // });

    const result = await this.sqlInit
      .delete()
      .from(Category)
      .where('id = :categoryId', { categoryId })
      .execute();

    return result.affected ? true : false;
  }
}
