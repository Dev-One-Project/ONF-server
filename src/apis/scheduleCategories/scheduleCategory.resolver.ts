import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { CreateScheduleCategoryInput } from './dto/createScheduleCategory.input';
import { UpdateScheduleCategoryInput } from './dto/updateScheduleCategory.input';
import { ScheduleCategory } from './entities/scheduleCategory.entity';
import { ScheduleCategoryService } from './scheduleCategory.service';

@Resolver()
export class ScheduleCategoryResolver {
  constructor(
    private readonly scheduleCategoryService: ScheduleCategoryService, //
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [ScheduleCategory], { description: '근무일정 유형 전체 조회' })
  async fetchAllScheduleCategories(
    @Context() context: IContext, //
  ) {
    const companyId = context.req.user.company;

    return await this.scheduleCategoryService.findAll({ companyId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => ScheduleCategory, { description: '근무일정 유형 생성' })
  async createScheduleCategory(
    @Context() context: IContext, //
    @Args('createScheduleCategoryInput')
    createScheduleCategoryInput: CreateScheduleCategoryInput,
  ) {
    const companyId = context.req.user.company;

    return await this.scheduleCategoryService.create({
      companyId,
      createScheduleCategoryInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
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

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '근무일정 유형 단일 삭제' })
  async deleteOneScheduleCategory(
    @Args('scheduleCategoryId') scheduleCategoryId: string, //
  ) {
    return await this.scheduleCategoryService.deleteOne({ scheduleCategoryId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '근무일정 유형 다수 삭제' })
  async deleteManyScheduleCategory(
    @Args({ name: 'scheduleCategoryId', type: () => [String] })
    scheduleCategoryId: string[], //
  ) {
    return await this.scheduleCategoryService.deleteMany({
      scheduleCategoryId,
    });
  }
}
