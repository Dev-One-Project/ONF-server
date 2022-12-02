import { InputType, PartialType } from '@nestjs/graphql';
import { CreateVacationCategoryInput } from './createVacationCategory.input';

@InputType()
export class UpdateVacationCategoryInput extends PartialType(
  CreateVacationCategoryInput,
) {}
