import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QueryResult } from 'typeorm';
import { CreateVacationIssueInput } from './dto/createVacationissue.input';
import { UpdateVacationIssueInput } from './dto/updateVacationissue.input';
import { VacationIssue } from './entities/vacationIssue.entity';
import { VacationIssuesService } from './vacationIssues.service';

@Resolver()
export class VacationIssuesResolver {
  constructor(
    private readonly vacationIssuesService: VacationIssuesService, //
  ) {}

  @Query(() => [VacationIssue], { description: '관리자 휴가 발생 조회' })
  async fetchVacationIssues(
    @Args('companyId') companyId: string, //
  ) {
    return await this.vacationIssuesService.findAll({ companyId });
  }

  @Query(() => VacationIssue, { description: '관리자 휴가 발생Id 조회' })
  async fetchVacationIssue(
    @Args('vacationIssueId') vacationIssueId: string, //
  ) {
    return await this.vacationIssuesService.findOne({ vacationIssueId });
  }

  @Query(() => [VacationIssue], {
    description: '관리자 비활성화된 사원도 같이조회',
  })
  async fetchVacationIssueWithDelete() {
    return await this.vacationIssuesService.findVacationIssueWithDelete();
  }

  @Query(() => [[VacationIssue]], {
    description: '기준일자 기준으로 휴가발생 조회하기',
  })
  async fetchVacationIssueBaseDate(
    @Args('baseDate') baseDate: Date,
    @Args('companyId') companyId: string,
  ) {
    return await this.vacationIssuesService.findDetailDate({
      companyId,
      baseDate,
    });
  }

  @Query(() => [[VacationIssue]], {
    description: '관지라 기준일자 기준으로 퇴사자랑 같이 조회',
  })
  async fetchVacationIssueWithDetailDelete(
    @Args('baseDate') baseDate: Date,
    @Args('companyId') companyId: string,
  ) {
    return await this.vacationIssuesService.findDetailDateWithDelete({
      companyId,
      baseDate,
    });
  }

  @Query(() => [VacationIssue], { description: '휴가 발생특정날짜 모두조회' })
  async fetchVacationIssueWithDate(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    return await this.vacationIssuesService.findVacationIssueWithDate({
      startDate,
      endDate,
    });
  }

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
