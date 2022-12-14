import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>, //
  ) {}

  async findAll({ companyId }) {
    return await this.memberRepository
      .createQueryBuilder('Member')
      .leftJoinAndSelect('Member.company', 'company')
      .leftJoinAndSelect('Member.category', 'category')
      .leftJoinAndSelect('Member.organization', 'organization')
      .where('Member.company = :id', { id: companyId })
      .getMany();
  }

  async findOne({ memberId }) {
    return await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['company', 'category', 'organization'],
    });
  }

  async create({ createMemberInput }) {
    console.log(createMemberInput);
    const { companyId, organizationId, categoryId, ...rest } =
      createMemberInput;

    return await this.memberRepository.save({
      ...rest,
      company: { id: companyId },
      organization: { id: organizationId },
      category: { id: categoryId },
    });
  }

  async update({ memberId, updateMemberInput }) {
    const findMemberId = await this.findOne({ memberId });

    const { organizationId, categoryId, ...rest } = updateMemberInput;

    const result = await this.memberRepository.save({
      ...findMemberId,
      id: findMemberId.id,
      ...rest,
      organization: { id: organizationId },
      category: { id: categoryId },
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
