import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateScheduleInput } from './dto/createSchedule.input';
import { UpdateScheduleInput } from './dto/updateSchedule.input';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';

@Resolver()
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService, //
  ) {}

  @Query(() => [Schedule], { description: '이번주 근무일정 조회 - 달력형' })
  async fetchWeekSchedule(
    @Args('today') today: Date, //
    @Args({ name: 'organizationId', type: () => [String] })
    organizationId: string[],
    @Args({ name: 'roleCategoryId', type: () => [String] })
    roleCategoryId: string[],
  ) {
    return await this.scheduleService.weekFind({
      today,
      organizationId,
      roleCategoryId,
    });
  }

  @Query(() => [Schedule], {
    description: '선택한 기간동안의 지점 근무일정 조회 - 목록형',
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

  @Mutation(() => [Schedule], { description: '근무일정 생성' })
  async createSchedule(
    @Args({ name: 'dates', type: () => [Date] }) dates: Date[],
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
  ) {
    return await this.scheduleService.create({ dates, createScheduleInput });
  }

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

  @Mutation(() => [Schedule], {
    description: 'scheduleId로 찾은 근무일정 다수 수정',
  })
  async updateAllSchedule(
    @Args({ name: 'scheduleId', type: () => [String] }) scheduleId: string[], //
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ) {
    return await this.scheduleService.updateAll({
      scheduleId,
      updateScheduleInput,
    });
  }

  @Mutation(() => Boolean, { description: '근무일정 단일 삭제' })
  async deleteOneSchedule(
    @Args('scheduleId') scheduleId: string, //
  ) {
    return await this.scheduleService.deleteOne({ scheduleId });
  }

  @Mutation(() => String, { description: '근무일정 다수 삭제' })
  async deleteManySchedule(
    @Args({ name: 'scheduleId', type: () => [String] }) scheduleId: string[],
  ) {
    return await this.scheduleService.deleteMany({ scheduleId });
  }
}
