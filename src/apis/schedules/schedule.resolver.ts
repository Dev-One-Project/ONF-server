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

  // 조직에 속한 멤버들의 근무기록들 조회(예정)

  @Query(() => Schedule)
  async fetchMemberSchedule(
    @Args('memberId') memberId: string, //
  ) {
    return await this.scheduleService.findMemberScheduleDetail({ memberId });
  }

  @Mutation(() => Schedule, { description: '근무기록 생성' })
  async createSchedule(
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput, //
  ) {
    return await this.scheduleService.create({ createScheduleInput });
  }

  @Mutation(() => Schedule, {
    description: 'scheduleId(근무기록Id)로 근무기록 수정',
  })
  async updateSchedule(
    @Args('scheduleId') scheduleId: string, //
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ) {
    return await this.scheduleService.update({
      scheduleId,
      updateScheduleInput,
    });
  }

  @Mutation(() => Boolean, { description: '근무기록 삭제' })
  async deleteSchedule(
    @Args('scheduleId') scheduleId: string, //
  ) {
    return await this.scheduleService.delete({ scheduleId });
  }
}
