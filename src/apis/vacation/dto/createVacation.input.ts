import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateVacationInput {
  @Field(() => [Date])
  vacations: Date[];

  @Field(() => String)
  description: string;

  @Field(() => String)
  vacationCategoryId: string;

  @Field(() => String)
  memberId: string;
}
