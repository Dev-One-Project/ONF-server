import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}
  private sqlInit = this.companyRepository.createQueryBuilder('company');

  async getCompanyDetail({ companyId }) {
    return await this.sqlInit
      .where('company.id = :companyId', { companyId })
      .getOne();
  }

  async createCompany({ createCompanyInput }) {
    return await this.sqlInit
      .insert()
      .into(Company)
      .values(createCompanyInput)
      .execute();
  }

  async updateCompanyDetail({ companyId, updateCompanyInput }) {
    const company = this.getCompanyDetail({ companyId });
    const updateData = {
      ...company,
      ...updateCompanyInput,
    };
    return await this.sqlInit
      .update(Company)
      .set(updateData)
      .where('id = :companyId', { companyId })
      .execute();
  }

  async deleteCompany({ companyId }) {
    //TODO: get member list and delete all members
    // => use memberService.hardDelete({ memberId })

    //TODO: get holiday list and delete all holidays
    //TODO: get category list and delete all categories
    //TODO: get organization list and delete all organizations
    //TODO: get company config and delete all company configs
    //TODO: get vacation category list and delete all vacation categories
    //TODO: get workinfo list and delete all workinfos
    //TODO: get schedule category list and delete all schedule categories

    //TODO: delete company
    const result = await this.sqlInit
      .delete()
      .from(Company)
      .where('id = :companyId', { companyId })
      .execute();

    //TODO: get account and delete account
    // => use accountService.hardDelete({ accountId })

    return result.affected ? true : false;
  }
}
