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

  async findAll() {
    return await this.memberRepository.find();
  }

  async findOne({ memberId }) {
    return await this.memberRepository.findOne({
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

  async hardDelete({ memberId }) {
    //TODO: get vacation list and delete all vacations
    //TODO: get schedule list and delete all schedules
    //TODO: get workcheck list and delete all workchecks

    const result = await this.memberRepository.delete({ memberId });

    return result.affected ? true : false;
  }
}
