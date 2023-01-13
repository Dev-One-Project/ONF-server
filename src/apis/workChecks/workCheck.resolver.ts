import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { plusNineHour } from 'src/common/libraries/utils';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { CreateWorkCheckInput } from './dto/createWorkCheck.input';
import { mainPageWorkCheckOutput } from './dto/mainPageWorkCheck.output';
import { UpdateWorkCheckInput } from './dto/updateWorkCheck.input';
import { WorkCheckOutput } from './dto/workCheck.output';
import { WorkCheckMemberOutput } from './dto/workCheckMember.output';
import { WorkCheck } from './entities/workCheck.entity';
import { WorkCheckService } from './workCheck.service';

@Resolver()
export class WorkCheckResolver {
  constructor(
    private readonly workCheckService: WorkCheckService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [WorkCheckOutput], {
    description: 'member개인(나)의 출퇴근 기록 조회 - 직원모드',
  })
  async fetchMemberWorkChecks(
    @Context() context: IContext, //
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    const result = await this.workCheckService.findMemberWorkCheck({
      memberId: context.req.user.member,
      startDate,
      endDate,
    });

    // result.map((time) => {
    //   plusNineHour(time.workingTime), plusNineHour(time.quittingTime);
    // });

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [WorkCheckMemberOutput], {
    description:
      '회사 지점에 속한 멤버들의 출퇴근 기록을 월별로 조회 - 달력형 - 관리자',
  })
  async fetchMonthWorkChecks(
    @Context() context: IContext, //
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('month') month: string,
    @Args('isActiveMember', { defaultValue: false }) isActiveMember: boolean,
  ) {
    const result = await this.workCheckService.findMonth({
      companyId: context.req.user.company,
      organizationId,
      month,
      isActiveMember,
    });

    // result.flat(2).map((time) => {
    //   plusNineHour(time.workingTime), plusNineHour(time.quittingTime);
    // });

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [WorkCheckOutput], {
    description:
      '지정된 기간동안의 회사+지점에 속한 멤버들의 출퇴근 기록 조회 - 목록형 - 관리자',
  })
  async fetchDateMemberWorkChecks(
    @Context() context: IContext, //
    @Args({ name: 'organizationId', type: () => [String], nullable: true })
    organizationId: string[],
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('isActiveMember', { defaultValue: false }) isActiveMember: boolean,
  ) {
    return await this.workCheckService.findDateMemberWorkCheck({
      companyId: context.req.user.company,
      organizationId,
      startDate,
      endDate,
      isActiveMember,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [mainPageWorkCheckOutput], {
    description: '메인페이지 출근,지각,미출근,휴가 조회(카운트)',
  })
  async fetchMainPageWorkCheck(
    @Context() context: IContext, //
  ) {
    const companyId = context.req.user.company;

    return await this.workCheckService.fetchMain({ companyId });
  }

  // @Roles(Role.ADMIN)
  // @UseGuards(GqlAuthAccessGuard, RolesGuard)
  // @Query(() => [WorkCheck])
  // async fetchWorkCheckOmission(
  //   @Context() context: IContext, //
  //   @Args('startDate') startDate: Date,
  //   @Args('endDate') endDate: Date,
  // ) {
  //   const companyId = context.req.user.company;

  //   return await this.workCheckService.findOmission({
  //     companyId,
  //     startDate,
  //     endDate,
  //   });
  // }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => WorkCheck, { description: '관리자용 출퇴근기록 생성하기' })
  async createAdminWorkCheck(
    @Context() context: IContext, //
    @Args('createWorkCheckInput') createWorkCheckInput: CreateWorkCheckInput,
  ) {
    return await this.workCheckService.createAdmin({
      companyId: context.req.user.company,
      createWorkCheckInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => WorkCheck, { description: '근무노트 생성' })
  async createWorkCheckMemo(
    @Args('workCheckId') workCheckId: string, //
    @Args('workCheckMemo') workCheckMemo: string,
  ): Promise<WorkCheck> {
    return await this.workCheckService.createMemo({
      workCheckId,
      workCheckMemo,
    });
  }

  // TODO : 무일정근무일 때 출근하기랑 근무일정 배정되었을 떄 출근하기가 다름
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => WorkCheck, { description: '출근하기' })
  async createStartWorkCheck(
    @Context() context: IContext, //
  ) {
    const result = await this.workCheckService.createStartWork({
      memberId: context.req.user.member,
    });

    plusNineHour(result.workDay);
    plusNineHour(result.workingTime);

    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => WorkCheck, { description: '퇴근하기' })
  async createEndWorkCheck(
    @Args('workCheckId') workCheckId: string, //
    @Context() context: IContext,
  ) {
    const memberId = context.req.user.member;

    const result = await this.workCheckService.createEndWork({
      workCheckId,
      memberId,
    });

    // plusNineHour(result.workingTime);
    // plusNineHour(result.quittingTime);

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => WorkCheck, { description: '출퇴근기록 단일 수정' })
  async updateOneWorkCheck(
    @Args('workCheckId') workCheckId: string, //
    @Args('updateWorkCheckInput') updateWorkCheckInput: UpdateWorkCheckInput,
  ) {
    const result = await this.workCheckService.updateOne({
      workCheckId,
      updateWorkCheckInput,
    });

    // plusNineHour(result.workingTime);
    // plusNineHour(result.quittingTime);

    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => [WorkCheck], { description: '출퇴근기록 다수 수정' })
  async updateManyWorkCheck(
    @Args({ name: 'workCheckId', type: () => [String] }) workCheckId: string[],
    @Args('updateWorkCheckInput') updateWorkCheckInput: UpdateWorkCheckInput,
  ) {
    return await this.workCheckService.updateMany({
      workCheckId,
      updateWorkCheckInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '출퇴근기록 단일 삭제' })
  async deleteOneWorkCheck(
    @Args('workCheckId') workCheckId: string, //
  ) {
    return await this.workCheckService.deleteOne({ workCheckId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '출근기록 다수 삭제' })
  async deleteManyWorkCheck(
    @Args({ name: 'workCheckId', type: () => [String] }) workCheckId: string[], //
  ) {
    return await this.workCheckService.deleteMany({ workCheckId });
  }
}
