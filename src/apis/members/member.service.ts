import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>, //
  ) {}

  async findAll({ companyId, isInActiveMember }) {
    if (isInActiveMember) {
      return await this.memberRepository.find({
        where: {
          company: { id: companyId },
          deletedAt: Not(IsNull()),
        },
        relations: ['company', 'roleCategory', 'organization'],
        withDeleted: true,
      });
    } else {
      return await this.memberRepository.find({
        where: { company: { id: companyId } },
        relations: ['company', 'roleCategory', 'organization'],
      });
    }
  }

  async findNumber({ companyId, isInActiveMember }) {
    if (isInActiveMember) {
      return await this.memberRepository
        .createQueryBuilder('Member')
        .where('Member.company = :companyId', { companyId })
        .andWhere('Member.deletedAt IS NOT NULL')
        .withDeleted()
        .getCount();
    } else {
      return await this.memberRepository
        .createQueryBuilder('Member')
        .where('Member.company = :companyId', { companyId })
        .getCount();
    }
  }

  async findOne({ memberId }) {
    return await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['company', 'roleCategory', 'organization'],
    });
  }

  async findOrg({ organizationId }) {
    return await this.memberRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['company', 'organization', 'roleCategory'],
    });
  }

  async findRole({ roleCategoryId }) {
    return await this.memberRepository.find({
      where: { roleCategory: { id: roleCategoryId } },
      relations: ['company', 'organization', 'roleCategory'],
    });
  }

  async findOrgRole({ organizationId, roleCategoryId }) {
    return await this.memberRepository.find({
      where: {
        organization: { id: organizationId },
        roleCategory: { id: roleCategoryId },
      },
      relations: ['company', 'organization', 'roleCategory'],
    });
  }

  async create({ createMemberInput, companyId }) {
    console.log(createMemberInput);
    const { organizationId, roleCategoryId, ...rest } = createMemberInput;

    return await this.memberRepository.save({
      ...rest,
      company: { id: companyId },
      organization: { id: organizationId },
      roleCategory: { id: roleCategoryId },
    });
  }

  async update({ memberId, updateMemberInput }) {
    const findMemberId = await this.findOne({ memberId });

    const { organizationId, roleCategoryId, ...rest } = updateMemberInput;

    const result = await this.memberRepository.save({
      ...findMemberId,
      id: findMemberId.id,
      ...rest,
      organization: { id: organizationId },
      roleCategory: { id: roleCategoryId },
    });

    return result;
  }

  async softDelete({ memberId }) {
    const result = await this.memberRepository.softDelete({ id: memberId });

    return result.affected ? true : false;
  }

  async hardDelete({ memberId }) {
    //TODO: get vacation list and delete all vacations
    //TODO: get schedule list and delete all schedules
    //TODO: get workcheck list and delete all workchecks

    const result = await this.memberRepository.delete({ id: memberId });

    return result.affected ? true : false;
  }
}
