import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVacationIssueInput } from './dto/createVacationissue.input';
import { UpdateVacationIssueInput } from './dto/updateVacationissue.input';
import { VacationIssue } from './entities/vacationIssue.entity';
import { VacationIssuesService } from './vacationIssues.service';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';

@Resolver()
export class VacationIssuesResolver {
  constructor(
    private readonly vacationIssuesService: VacationIssuesService, //
  ) {}

  @Query(() => VacationIssue, { description: '관리자 휴가 발생Id 조회' })
  async fetchVacationIssue(
    @Args('vacationIssueId') vacationIssueId: string, //
  ) {
    return await this.vacationIssuesService.findOne({ vacationIssueId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [[VacationIssue]], {
    description: '관리자 EndDate가 기준일자인 휴가발생 조회하기',
  })
  async fetchVacationIssueBaseDate(
    @Args('baseDate') baseDate: Date,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() ctx: IContext,
  ) {
    return await this.vacationIssuesService.fetchVacationIssueBaseDate({
      startDate,
      endDate,
      companyId: ctx.req.user.company,
      baseDate,
      organizationId,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [[VacationIssue]], {
    description: '관지라 EndDate가 기준일자이고, 퇴사자랑 같이 조회',
  })
  async fetchVacationIssueWithBaseDateDelete(
    @Args('baseDate') baseDate: Date,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() ctx: IContext,
  ) {
    return await this.vacationIssuesService.fetchVacationIssueWithBaseDateDelete(
      {
        startDate,
        endDate,
        companyId: ctx.req.user.company,
        baseDate,
        organizationId,
      },
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [[VacationIssue]], {
    description: '관리자 기준일자 기준으로 앞에 발생된 휴가 목록 조회',
  })
  async fetchVacationIssueDetailDate(
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() ctx: IContext,
  ) {
    return await this.vacationIssuesService.findWithDetailDate({
      startDate,
      endDate,
      companyId: ctx.req.user.company,

      organizationId,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [[VacationIssue]], {
    description: '관리자 기준일자 기준으로 앞에 발생된 휴가 퇴사자랑 같이 조회',
  })
  async fetchVacationIssueDetailDateDelete(
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Context() ctx: IContext,
  ) {
    return await this.vacationIssuesService.findWithDetailDateDelete({
      startDate,
      endDate,
      companyId: ctx.req.user.company,
      organizationId,
    });
  }

  // @Query(() => [VacationIssue], { description: '휴가 발생특정날짜 모두조회' })
  // async fetchVacationIssueWithDate(
  //   @Args('startDate') startDate: Date,
  //   @Args('endDate') endDate: Date,
  // ) {
  //   return await this.vacationIssuesService.findVacationIssueWithDate({
  //     startDate,
  //     endDate,
  //   });
  // }

  @Mutation(() => VacationIssue, { description: '관리자 휴가 발생 만들기' })
  async createVacationIssue(
    @Args('createVacationIssueInput')
    createVacationIssueInput: CreateVacationIssueInput, //
  ) {
    return await this.vacationIssuesService.create({
      createVacationIssueInput,
    });
  }

  @Mutation(() => VacationIssue, { description: '관리자 휴가 발생 수정하기' })
  async updateVacationIssue(
    @Args('vacationIssueId') vacationIssueId: string,
    @Args('updateVacationIssueInput')
    updateVacationIssueInput: UpdateVacationIssueInput,
  ) {
    return await this.vacationIssuesService.update({
      vacationIssueId,
      updateVacationIssueInput,
    });
  }

  @Mutation(() => [VacationIssue], {
    description: '관리자 휴가발생 다수 수정하기 ',
  })
  async UpdateManyVacationsIssue(
    @Args({ name: 'vacationIssueId', type: () => [String] })
    vacationIssueId: string[],
    @Args('updateVacationIssueInput', { nullable: true })
    updateVacationIssueInput: UpdateVacationIssueInput,
  ) {
    return await this.vacationIssuesService.updateMany({
      vacationIssueId,
      updateVacationIssueInput,
    });
  }

  @Mutation(() => Boolean, { description: '관리자 휴가 발생 삭제하기' })
  async deleteVacationIssue(
    @Args('vacationIssueId') vacationIssueId: string, //
  ) {
    return await this.vacationIssuesService.delete({ vacationIssueId });
  }

  @Mutation(() => Boolean, { description: '관리자 휴가발생 다수 삭제하기' })
  async deleteManyVacationIssue(
    @Args({ name: 'vacationIssueId', type: () => [String] })
    vacationIssueId: string[],
  ) {
    return await this.vacationIssuesService.deleteMany({
      vacationIssueId,
    });
  }
}
