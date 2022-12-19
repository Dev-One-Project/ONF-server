import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plusNineHour } from 'src/common/libraries/utils';
import { CreateWorkCheckInput } from './dto/createWorkCheck.input';
import { UpdateWorkCheckInput } from './dto/updateWorkCheck.input';
import { WorkCheck } from './entities/workCheck.entity';
import { WorkCheckService } from './workCheck.service';

@Resolver()
export class WorkCheckResolver {
  constructor(
    private readonly workCheckService: WorkCheckService, //
  ) {}

  @Query(() => [WorkCheck], {
    description: '해당 회사에 속하는 member들의 출퇴근 기록 조회',
  })
  async fetchCompanyWorkChecks(
    @Args('companyId') companyId: string, //
  ) {
    return await this.workCheckService.findCompanyWorkCheck({ companyId });
  }

  @Query(() => [WorkCheck], { description: 'member개인의 출퇴근 기록 조회' })
  async fetchMemberWorkChecks(
    @Args('memberId') memberId: string, //
  ) {
    return await this.workCheckService.findMemberWorkCheck({ memberId });
  }

  @Query(() => [[WorkCheck]], {
    description: '회사 지점에 속한 멤버들의 출퇴근 기록을 월별로 조회',
  })
  async fetchMonthWorkChecks(
    @Args('comapnyId') companyId: string, //
    // @Args('organizationId', { nullable: true }) organizationId: string,
    @Args('month') month: string,
  ) {
    return await this.workCheckService.findMonth({ companyId, month });
  }

  @Query(() => [WorkCheck], {
    description: '지정된 기간동안의 회사+지점에 속한 멤버들의 출퇴근 기록 조회',
  })
  async fetchDateMemberWorkChecks(
    @Args('companyId') companyId: string, //
    @Args({ name: 'organizationId', type: () => [String], nullable: true })
    organizationId: string[],
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    return await this.workCheckService.findDateMemberWorkCheck({
      companyId,
      organizationId,
      startDate,
      endDate,
    });
  }

  // TODO : 일단 임시로 만들었고 수정해야할듯??
  @Mutation(() => WorkCheck, { description: '관리자용 출퇴근기록 생성하기' })
  async createAdminWorkCheck(
    @Args('companyId') companyId: string, //
    @Args('createWorkCheckInput') createWorkCheckInput: CreateWorkCheckInput,
  ) {
    return await this.workCheckService.createAdmin({
      companyId,
      createWorkCheckInput,
    });
  }

  @Mutation(() => WorkCheck, { description: '근무노트 생성' })
  async createWorkCheckMemo(
    @Args('workCheckId') workCheckId: string, //
    @Args('workCheckMemo') workCheckMemo: string,
  ) {
    return await this.workCheckService.createMemo({
      workCheckId,
      workCheckMemo,
    });
  }

  @Mutation(() => WorkCheck, { description: '출근기록 자동 생성' })
  async createStartWorkCheck(
    @Args('memberId') memberId: string, // guard 넣게 되면 빼야 될듯???
  ) {
    const result = await this.workCheckService.createStartWork({ memberId });

    plusNineHour(result.workingTime);

    return result;
  }

  @Mutation(() => WorkCheck, { description: '퇴근기록 자동 생성' })
  async createEndWorkCheck(
    @Args('workCheckId') workCheckId: string, //
  ) {
    const result = await this.workCheckService.createEndWork({ workCheckId });

    plusNineHour(result.quittingTime);

    return result;
  }

  @Mutation(() => WorkCheck, {
    description: '휴게시작 시간 자동 생성(자동 휴게시간 설정 때는 X)',
  })
  async createStartBreakTime(
    @Args('workCheckId') workCheckId: string, //
  ) {
    const result = await this.workCheckService.createStartBreak({
      workCheckId,
    });

    plusNineHour(result.breakStartTime);

    return result;
  }

  @Mutation(() => WorkCheck, {
    description: '휴게종료 시간 자동 생성',
  })
  async createEndBreakTime(
    @Args('workCheckId') workCheckId: string, //
  ) {
    const result = await this.workCheckService.createEndBreak({ workCheckId });

    plusNineHour(result.breakEndTime);

    return result;
  }

  @Mutation(() => WorkCheck, { description: '출퇴근기록 수정' })
  async updateWorkCheck(
    @Args('workCheckId') workCheckId: string, //
    @Args('updateWorkCheckInput') updateWorkCheckInput: UpdateWorkCheckInput,
  ) {
    const result = await this.workCheckService.update({
      workCheckId,
      updateWorkCheckInput,
    });

    plusNineHour(result.workingTime);
    plusNineHour(result.quittingTime);
    plusNineHour(result.breakStartTime);
    plusNineHour(result.breakEndTime);

    return result;
  }

  // 여러명 동시에 수정되는거도 만들어야함

  @Mutation(() => Boolean, { description: '출퇴근기록 삭제' })
  async deleteWorkCheck(
    @Args('workCheckId') workCheckId: string, //
  ) {
    return await this.workCheckService.delete({ workCheckId });
  }
}
