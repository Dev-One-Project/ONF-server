import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateScheduleCategoryInput } from './dto/createScheduleCategory.input';
import { UpdateScheduleCategoryInput } from './dto/updateScheduleCategory.input';
import { ScheduleCategory } from './entities/scheduleCategory.entity';
import { ScheduleCategoryService } from './scheduleCategory.service';

@Resolver()
export class ScheduleCategoryResolver {
  constructor(
    private readonly scheduleCategoryService: ScheduleCategoryService, //
  ) {}

  @Query(() => [ScheduleCategory], { description: '근무일정 유형 전체 조회' })
  async fetchAllScheduleCategories() {
    // @Args('companyId') companyId: string, // 가드 추가되면 뺄거임
    return await this.scheduleCategoryService.findAll();
  }

  @Mutation(() => ScheduleCategory, { description: '근무일정 유형 생성' })
  async createScheduleCategory(
    @Args('createScheduleCategoryInput')
    createScheduleCategoryInput: CreateScheduleCategoryInput, //
  ) {
    return await this.scheduleCategoryService.create({
      createScheduleCategoryInput,
    });
  }

  @Mutation(() => ScheduleCategory, { description: '근무일정 유형 수정' })
  async updateScheduleCategory(
    @Args('scheduleCategoryId') scheduleCategoryId: string, //
    @Args('updateScheduleCategoryInput')
    updateScheduleCategoryInput: UpdateScheduleCategoryInput,
  ) {
    return await this.scheduleCategoryService.update({
      scheduleCategoryId,
      updateScheduleCategoryInput,
    });
  }

  @Mutation(() => Boolean, { description: '근무일정 유형 삭제' })
  async deleteScheduleCategory(
    @Args('scheduleCategoryId') scheduleCategoryId: string, //
  ) {
    return await this.scheduleCategoryService.delete({ scheduleCategoryId });
  }
}
