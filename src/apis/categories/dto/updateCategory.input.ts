import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './createCategory.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
