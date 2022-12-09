import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMemberInput } from './dto/createMember.input';
import { UpdateMemberInput } from './dto/updateMemberInput';
import { Member } from './entities/member.entity';
import { MemberService } from './member.service';

@Resolver()
export class MemberResolver {
  constructor(
    private readonly memberService: MemberService, //
  ) {}

  @Query(() => [Member], { description: 'comanyId에 해당하는 멤버 전체 조회' })
  async fetchMembers(
    @Args('companyId') companyId: string, //
  ) {
    return await this.memberService.findAll({ companyId });
  }

  @Query(() => Member, { description: 'memberId(사원ID)로 개별 조회' })
  async fetchMember(
    @Args('memberId') memberId: string, //
  ) {
    return await this.memberService.findOne({ memberId });
  }

  @Mutation(() => Member, { description: '멤버 정보 입력' })
  async createMember(
    @Args('createMemberInput') createMemberInput: CreateMemberInput, //
  ) {
    return await this.memberService.create({ createMemberInput });
  }

  @Mutation(() => Member, { description: '멤버 정보 수정' })
  async updateMember(
    @Args('memberId') memberId: string, //
    @Args('updateMemberInput') updateMemberInput: UpdateMemberInput,
  ) {
    return await this.memberService.update({ memberId, updateMemberInput });
  }

  @Mutation(() => Boolean, { description: '멤버 정보 소프트 삭제' })
  async softDeleteMember(
    @Args('memberId') memberId: string, //
  ) {
    return await this.memberService.softDelete({ memberId });
  }

  @Mutation(() => Boolean, { description: '멤버 정보 완전 삭제' })
  async deleteMember(
    @Args('memberId') memberId: string, //
  ) {
    return await this.memberService.hardDelete({ memberId });
  }
}
