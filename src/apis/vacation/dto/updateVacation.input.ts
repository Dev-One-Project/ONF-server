import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateVacationInput {
  @Field(() => Date)
  vacationStartDate: Date;

  @Field(() => Date)
  vacationEndDate: Date;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String)
  vacationCategoryId: string;

  @Field(() => String)
  memberId: string;
}
