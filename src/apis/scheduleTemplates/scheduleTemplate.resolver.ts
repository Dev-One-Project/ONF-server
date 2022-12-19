import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateScheduleTemplateInput } from './dto/createScheduleTemplate.input';
import { UpdateScheduleTemplatInput } from './dto/updateSchduleTemplate.input';
import { ScheduleTemplate } from './entities/scheduleTemplate.entity';
import { ScheduleTemplateService } from './scheduleTemplate.service';

@Resolver()
export class ScheduleTemplateResolver {
  constructor(
    private readonly scheduleTemplateService: ScheduleTemplateService, //
  ) {}

  @Query(() => [ScheduleTemplate], { description: '근무일정 템플릿 전체 조회' })
  async fetchAllScheduleTemplates() {
    return await this.scheduleTemplateService.findAll();
  }

  @Mutation(() => ScheduleTemplate, { description: '근무일정 템플릿 생성' })
  async createScheduleTemplate(
    @Args('createScheduleTemplateInput')
    createScheduleTemplateInput: CreateScheduleTemplateInput, //
  ) {
    return await this.scheduleTemplateService.create({
      createScheduleTemplateInput,
    });
  }

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

  @Mutation(() => Boolean, { description: '근무일정 템플릿 삭제' })
  async deleteScheduleTemplate(
    @Args('scheduleTemplateId') scheduleTemplateId: string, //
  ) {
    return await this.scheduleTemplateService.delete({ scheduleTemplateId });
  }
}
