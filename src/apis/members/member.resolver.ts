import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMemberInput } from './dto/createMember.input';
import { UpdateMemberInput } from './dto/updateMemberInput';
import { Member } from './entities/member.entity';
import { MemberService } from './member.service';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';

@Resolver()
export class MemberResolver {
  constructor(
    private readonly memberService: MemberService, //
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Member], { description: 'comanyId에 해당하는 멤버 전체 조회' })
  async fetchMembers(@Context() context: IContext) {
    return await this.memberService.findAll({
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => Member, {
    description:
      'memberId(사원ID)로 개별 조회, memberId 입력시 입력한 member 조회, 아니면 로그인한 유저 정보 조회',
  })
  async fetchMember(
    @Args({ name: 'memberId', nullable: true }) memberId: string,
    @Context() context: IContext,
  ) {
    if (memberId === null || memberId === undefined)
      return await this.memberService.findOne({
        memberId: context.req.user.id,
      });
    else return await this.memberService.findOne({ memberId });
  }

  // TODO : 지점별로 멤버들 조회, 직무 별로 멤버들 조회, 지점+직무로 멤버 조회

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Member, { description: '멤버 정보 입력' })
  async createMember(
    @Args('createMemberInput') createMemberInput: CreateMemberInput, //
    @Context() context: IContext,
  ) {
    return await this.memberService.create({
      createMemberInput,
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Member, { description: '멤버 정보 수정' })
  async updateMember(
    @Args('memberId') memberId: string, //
    @Args('updateMemberInput') updateMemberInput: UpdateMemberInput,
  ) {
    return await this.memberService.update({ memberId, updateMemberInput });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '멤버 정보 소프트 삭제' })
  async softDeleteMember(
    @Args('memberId') memberId: string, //
  ) {
    return await this.memberService.softDelete({ memberId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '멤버 정보 완전 삭제' })
  async deleteMember(
    @Args('memberId') memberId: string, //
  ) {
    return await this.memberService.hardDelete({ memberId });
  }
}
