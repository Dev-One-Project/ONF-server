import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateVacationCategoryInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  timeOption: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => Int)
  paidTime: number;

  @Field(() => Number)
  deductionDays: number;

  @Field(() => String)
  organizationId: string;

  @Field(() => String)
  roleCategoryId: string;
}
