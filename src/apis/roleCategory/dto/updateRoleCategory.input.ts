import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRoleCategoryInput } from './createRoleCategory.input';

@InputType()
export class UpdateRoleCategoryInput extends PartialType(
  CreateRoleCategoryInput,
) {}
