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

  findAll() {
    return this.memberRepository.find();
  }

  findOne({ memberId }) {
    return this.memberRepository.findOne({
      where: { memberId },
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
      memberId: findMemberId.memberId,
      ...updateMemberInput,
    });

    return result;
  }

  async delete({ memberId }) {
    const result = await this.memberRepository.softDelete({ memberId });

    return result.affected ? true : false;
  }
}
