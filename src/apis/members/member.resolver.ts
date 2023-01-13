import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  @Query(() => [Member], {
    description:
      'comanyId에 해당하는 멤버 전체 조회, 비활성화버튼을 통해 비활성화 멤버 검색',
  })
  async fetchMembers(
    @Context() context: IContext, //x
    @Args('isInActiveMember', { defaultValue: false })
    isInActiveMember: boolean,
  ) {
    return await this.memberService.findAll({
      companyId: context.req.user.company,
      isInActiveMember,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => Int, { description: '회사내의 직원 수 카운트' })
  async fetchNumberOfEmployees(
    @Context() context: IContext, //
    @Args('isInActiveMember', { defaultValue: false })
    isInActiveMember: boolean,
  ) {
    const companyId = context.req.user.company;

    return await this.memberService.findNumber({ companyId, isInActiveMember });
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

  @Query(() => [Member], { description: '회사 내의 지점별 직원 조회' })
  async fetchMemberInOrg(
    @Args('organizationId') organizationId: string, //
  ) {
    return await this.memberService.findOrg({ organizationId });
  }

  @Query(() => [Member], { description: '회사 내의 직무별 직원 조회' })
  async fetchMemberInRole(
    @Args('roleCategoryId') roleCategoryId: string, //
  ) {
    return await this.memberService.findRole({ roleCategoryId });
  }

  @Query(() => [Member], { description: '회사 내의 지점+직무 직원 조회' })
  async fetchMemberInRoleOrg(
    @Args('organizationId') organizationId: string, //
    @Args('roleCategoryId') roleCategoryId: string,
  ) {
    return await this.memberService.findOrgRole({
      organizationId,
      roleCategoryId,
    });
  }

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
