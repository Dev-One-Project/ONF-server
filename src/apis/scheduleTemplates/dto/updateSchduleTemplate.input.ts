import { InputType, PartialType } from '@nestjs/graphql';
import { CreateScheduleTemplateInput } from './createScheduleTemplate.input';

@InputType()
export class UpdateScheduleTemplatInput extends PartialType(
  CreateScheduleTemplateInput,
) {}
