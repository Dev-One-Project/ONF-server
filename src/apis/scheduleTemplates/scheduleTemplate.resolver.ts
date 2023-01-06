import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { CreateScheduleTemplateInput } from './dto/createScheduleTemplate.input';
import { UpdateScheduleTemplatInput } from './dto/updateSchduleTemplate.input';
import { ScheduleTemplate } from './entities/scheduleTemplate.entity';
import { ScheduleTemplateService } from './scheduleTemplate.service';

@Resolver()
export class ScheduleTemplateResolver {
  constructor(
    private readonly scheduleTemplateService: ScheduleTemplateService, //
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [ScheduleTemplate], { description: '근무일정 템플릿 전체 조회' })
  async fetchAllScheduleTemplates(
    @Context() context: IContext, //
  ) {
    const companyId = context.req.user.company;

    return await this.scheduleTemplateService.findAll({ companyId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, UseGuards)
  @Mutation(() => ScheduleTemplate, { description: '근무일정 템플릿 생성' })
  async createScheduleTemplate(
    @Context() context: IContext, //
    @Args('createScheduleTemplateInput')
    createScheduleTemplateInput: CreateScheduleTemplateInput,
  ) {
    const companyId = context.req.user.company;

    return await this.scheduleTemplateService.create({
      companyId,
      createScheduleTemplateInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, UseGuards)
  @Mutation(() => ScheduleTemplate, { description: '근무일정 템플릿 수정' })
  async updateScheduleTemplate(
    @Args('scheduleTemplateId') scheduleTemplateId: string, //
    @Args('updateScheduleTemplateInput')
    updateScheduleTemplateInput: UpdateScheduleTemplatInput,
  ) {
    return await this.scheduleTemplateService.update({
      scheduleTemplateId,
      updateScheduleTemplateInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, UseGuards)
  @Mutation(() => Boolean, { description: '근무일정 템플릿 단일 삭제' })
  async deleteOneScheduleTemplate(
    @Args('scheduleTemplateId') scheduleTemplateId: string, //
  ) {
    return await this.scheduleTemplateService.deleteOne({ scheduleTemplateId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, UseGuards)
  @Mutation(() => Boolean, { description: '근무일정 템플릿 다수 삭제' })
  async deleteManyScheduleTemplate(
    @Args({ name: 'scheduleTemplateId', type: () => [String] })
    scheduleTemplateId: string[],
  ) {
    return await this.scheduleTemplateService.deleteMany({
      scheduleTemplateId,
    });
  }
}
