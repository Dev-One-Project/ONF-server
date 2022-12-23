import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVacationIssueInput } from './dto/createVacationissue.input';
import { UpdateVacationIssueInput } from './dto/updateVacationissue.input';
import { VacationIssue } from './entities/vacationIssue.entity';
import { VacationIssuesService } from './vacationIssues.service';

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

  @Query(() => [[VacationIssue]], {
    description: '관리자 EndDate가 기준일자인 휴가발생 조회하기',
  })
  async fetchVacationIssueBaseDate(
    @Args('baseDate') baseDate: Date,
    @Args('companyId') companyId: string,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
  ) {
    return await this.vacationIssuesService.fetchVacationIssueBaseDate({
      startDate,
      endDate,
      companyId,
      baseDate,
      organizationId,
    });
  }

  @Query(() => [[VacationIssue]], {
    description: '관지라 EndDate가 기준일자이고, 퇴사자랑 같이 조회',
  })
  async fetchVacationIssueWithBaseDateDelete(
    @Args('baseDate') baseDate: Date,
    @Args('companyId') companyId: string,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
  ) {
    return await this.vacationIssuesService.fetchVacationIssueWithBaseDateDelete(
      {
        startDate,
        endDate,
        companyId,
        baseDate,
        organizationId,
      },
    );
  }

  @Query(() => [[VacationIssue]], {
    description: '관리자 기준일자 기준으로 앞에 발생된 휴가 목록 조회',
  })
  async fetchVacationIssueDetailDate(
    @Args('baseDate') baseDate: Date,
    @Args('companyId') companyId: string,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
  ) {
    return await this.vacationIssuesService.findWithDetailDate({
      startDate,
      endDate,
      companyId,
      baseDate,
      organizationId,
    });
  }

  @Query(() => [[VacationIssue]], {
    description: '관리자 기준일자 기준으로 앞에 발생된 휴가 퇴사자랑 같이 조회',
  })
  async fetchVacationIssueDetailDateDelete(
    @Args('baseDate') baseDate: Date,
    @Args('companyId') companyId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
  ) {
    return await this.vacationIssuesService.findWithDetailDateDelete({
      startDate,
      endDate,
      companyId,
      baseDate,
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

  @Mutation(() => Boolean, { description: '관리자 휴가 발생 삭제하기' })
  async deleteVacationIssue(
    @Args('vacationIssueId') vacationIssueId: string, //
  ) {
    return await this.vacationIssuesService.delete({ vacationIssueId });
  }
}
