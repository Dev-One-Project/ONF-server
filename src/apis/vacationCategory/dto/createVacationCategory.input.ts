import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateVacationCategoryInput {
  @Field(() => String)
  vacationCategoryGroup: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  timeOption: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => Int)
  paidTime: number;

  @Field(() => Int)
  deductionDays: number;
}
