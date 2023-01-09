import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateVacationInput {
  @Field(() => Date, { nullable: true })
  vacationStartDate: Date;

  @Field(() => Date, { nullable: true })
  vacationEndDate: Date;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  vacationCategoryId: string;

  @Field(() => String, { nullable: true })
  memberId: string;
}
