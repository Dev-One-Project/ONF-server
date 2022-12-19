import { InputType, PartialType } from '@nestjs/graphql';
import { CreateScheduleCategoryInput } from './createScheduleCategory.input';

@InputType()
export class UpdateScheduleCategoryInput extends PartialType(
  CreateScheduleCategoryInput,
) {}
