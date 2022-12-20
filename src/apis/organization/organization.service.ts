import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../companies/company.service';
import { Member } from '../members/entities/member.entity';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly companyService: CompanyService,
  ) {}

  async findAll({ companyId }) {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();
  }

  async getOrganizationDetail({ organizationId }) {
    return await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.company', 'company')
      .where('organization.id = :organizationId', { organizationId })
      .getOne();
  }

  async create({ createOrganizationInput }) {
    const company = await this.companyService.getCompanyDetail({
      companyId: createOrganizationInput.companyId,
    });
    const organization = this.organizationRepository.create({
      ...createOrganizationInput,
      company,
    });
    return await this.organizationRepository.save(organization);
  }

  async update({ organizationId, updateOrganizationInput }) {
    const organization = this.getOrganizationDetail({ organizationId });
    const company = await this.companyService.getCompanyDetail({
      companyId: updateOrganizationInput.companyId,
    });
    const updateData = {
      ...organization,
      ...updateOrganizationInput,
      company,
    };
    return await this.organizationRepository.save(updateData);
  }

  async delete({ organizationId }) {
    //TODO: get all workcheck by organizationId and remove relation with organization
    //TODO: get all schedule by organizationId and remove relation with organization
    //TODO: get all LeaveCategory by organizationId and remove relation with organization

    //get all member by organizationId and remove relation with organization
    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.organization', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .getMany();

    members.forEach(async (member) => {
      await this.memberRepository
        .createQueryBuilder('member')
        .update(Member)
        .set({ organization: null })
        .where('id = :memberId', { memberId: member.id })
        .execute();
    });

    const result = await this.organizationRepository
      .createQueryBuilder('organization')
      .delete()
      .from(Organization)
      .where('id = :organizationId', { organizationId })
      .execute();

    return result.affected ? true : false;
  }
}
