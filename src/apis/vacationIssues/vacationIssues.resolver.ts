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

  //   @Query(() => [VacationIssue], {
  //     description: '기준일자 기준으로 휴가발생 조회하기',
  //   })

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
