import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateVacationCategoryInput } from './createVacationCategory.input';

@InputType()
export class UpdateVacationCategoryInput {
  @Field(() => String, { nullable: true })
  vacations: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  vacationCategoryId: string;

  @Field(() => String)
  memberId: string;
}
