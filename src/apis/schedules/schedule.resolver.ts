import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { CreateScheduleInput } from './dto/createSchedule.input';
import { UpdateScheduleInput } from './dto/updateSchedule.input';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';

@Resolver()
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService, //
  ) {}

  @Query(() => Schedule, {
    nullable: true,
    description: '멤버의 특정날짜 근무일정 조회',
  })
  async fetchMemberSchedule(
    @Args('memberId') memberId: string, //
    @Args('date') date: Date,
  ) {
    return await this.scheduleService.findMemberSchedule({ memberId, date });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [[Schedule]], {
    description: '한달동안의 멤버들 근무일정 조회 - 직원용',
  })
  async fetchMonthMemberSchedule(
    @Args({ name: 'memberId', type: () => [String] }) memberId: string[], //
    @Context() context: IContext,
  ) {
    const companyId = context.req.user.company;

    return await this.scheduleService.monthFind({ memberId, companyId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Schedule], {
    description: '선택한 기간동안의 근무일정 조회 - 목록형 - 관리자',
  })
  async fetchListTypeSchedule(
    @Args('startDate') startDate: Date, //
    @Args('endDate') endDate: Date,
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
  ) {
    return await this.scheduleService.listFind({
      startDate,
      endDate,
      organizationId,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => [Schedule], { description: '근무일정 생성' })
  async createSchedule(
    @Args({ name: 'dates', type: () => [Date] }) dates: Date[],
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
  ) {
    return await this.scheduleService.create({ dates, createScheduleInput });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Schedule, { description: '근무일정 단일 수정' })
  async updateOneSchedule(
    @Args('scheduleId') scheduleId: string, //
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ) {
    return await this.scheduleService.updateOne({
      scheduleId,
      updateScheduleInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => [Schedule], {
    description: 'scheduleId로 찾은 근무일정 다수 수정',
  })
  async updateManySchedule(
    @Args({ name: 'scheduleId', type: () => [String] }) scheduleId: string[], //
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ) {
    return await this.scheduleService.updateMany({
      scheduleId,
      updateScheduleInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '근무일정 단일 삭제' })
  async deleteOneSchedule(
    @Args('scheduleId') scheduleId: string, //
  ) {
    return await this.scheduleService.deleteOne({ scheduleId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '근무일정 다수 삭제' })
  async deleteManySchedule(
    @Args({ name: 'scheduleId', type: () => [String] }) scheduleId: string[],
  ) {
    return await this.scheduleService.deleteMany({ scheduleId });
  }
}
