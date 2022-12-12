import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plusNineHour } from 'src/common/libraries/utils';
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

  @Query(() => [WorkCheck], {
    description: '지정된 기간동안의 회사에 속한 멤버들의 출퇴근 기록 조회',
  })
  async fetchDateMemberWorkChecks(
    @Args('companyId') companyId: string, //
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    return await this.workCheckService.findDateMemberWorkCheck({
      companyId,
      startDate,
      endDate,
    });
  }

  // 멤버 조회

  // 회사+조직조회

  // 관리자용 출근기록 생성(시간 받아오기)
  // @Mutation(() => WorkCheck, { description: '관리자용 출근기록 생성' })
  // async createAdminWorkCheck() {
  //   return;
  // }

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

  @Mutation(() => WorkCheck, { description: '출근기록 생성' })
  async createStartWorkCheck(
    @Args('memberId') memberId: string, // guard 넣게 되면 빼야 될듯???
  ) {
    const result = await this.workCheckService.createStartWork({ memberId });

    plusNineHour(result.workingTime);

    return result;
  }

  @Mutation(() => WorkCheck, {
    description: '퇴근시간 생성',
  })
  async createEndWorkCheck(
    @Args('workCheckId') workCheckId: string, //
  ) {
    const result = await this.workCheckService.createEndWork({ workCheckId });

    plusNineHour(result.quittingTime);

    return result;
  }

  @Mutation(() => WorkCheck, { description: '휴게시작 시간 생성' })
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
    description: '휴게종료 시간 생성',
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

    // plusNineHour(result.workingTime);
    // plusNineHour(result.quittingTime);
    // plusNineHour(result.breakStartTime);
    // plusNineHour(result.breakEndTime);

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
