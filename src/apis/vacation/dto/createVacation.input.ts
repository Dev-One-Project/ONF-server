import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateVacationInput {
  @Field(() => [Date], { nullable: true })
  vacations: Date[];

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  vacationCategoryId: string;

  @Field(() => String)
  memberId: string;
}
