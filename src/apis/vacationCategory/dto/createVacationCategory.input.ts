import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateVacationCategoryInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  timeOption: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => Int, { nullable: true })
  paidTime: number;

  @Field(() => Number, { nullable: true })
  deductionDays: number;

  @Field(() => String, { nullable: true })
  organizationId: string;

  @Field(() => String, { nullable: true })
  roleCategoryId: string;
}
