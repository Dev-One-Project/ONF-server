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
      .where('Member.company = :id', { id: companyId })
      .getMany();
  }

  async findOne({ memberId }) {
    return await this.memberRepository.findOne({
      where: { id: memberId },
    });
  }

  async create({ createMemberInput }) {
    return await this.memberRepository.save({
      ...createMemberInput,
    });
  }

  async update({ memberId, updateMemberInput }) {
    const findMemberId = await this.findOne({ memberId });

    const result = await this.memberRepository.save({
      ...findMemberId,
      memberId: findMemberId.id,
      ...updateMemberInput,
    });

    return result;
  }

  async hardDelete({ memberId }) {
    //TODO: get vacation list and delete all vacations
    //TODO: get schedule list and delete all schedules
    //TODO: get workcheck list and delete all workchecks

    const result = await this.memberRepository.delete({ id: memberId });

    return result.affected ? true : false;
  }
}
