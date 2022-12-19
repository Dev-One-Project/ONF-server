import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { Company } from './entities/company.entity';
import { GlobalConfig } from '../globalConfig/entities/globalConfig.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(RoleCategory)
    private readonly roleCategoryRepository: Repository<RoleCategory>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(GlobalConfig)
    private readonly globalConfigRepository: Repository<GlobalConfig>,
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
    //get member list and delete all members
    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();

    members.forEach(async (member) => {
      await this.memberRepository
        .createQueryBuilder('member')
        .delete()
        .from(Member)
        .where('id = :memberId', { memberId: member.id })
        .execute();
    });

    //TODO: get holiday list and delete all holidays

    //get category list and delete all categories
    const categories = await this.roleCategoryRepository
      .createQueryBuilder('roleCategory')
      .leftJoinAndSelect('roleCategory.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();

    categories.forEach(async (category) => {
      await this.roleCategoryRepository
        .createQueryBuilder('category')
        .delete()
        .from(RoleCategory)
        .where('id = :categoryId', { categoryId: category.id })
        .execute();
    });

    //get organization list and delete all organizations
    const organizations = await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();

    organizations.forEach(async (organization) => {
      await this.organizationRepository
        .createQueryBuilder('organization')
        .delete()
        .from(Organization)
        .where('id = :organizationId', { organizationId: organization.id })
        .execute();
    });

    //delete globalConfig
    this.globalConfigRepository.createQueryBuilder('globalConfig').delete();

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
